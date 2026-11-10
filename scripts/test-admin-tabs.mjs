// Run with: node scripts/test-admin-tabs.mjs
// Exercise the production coordinator with an in-memory browser API; no browser/profile changes.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(
  new URL('../entrypoints/common/tabs.ts', import.meta.url),
  'utf8',
);
const parsed = ts.createSourceFile('tabs.ts', source, ts.ScriptTarget.Latest, true);
const withoutImports = parsed.statements
  .filter(node => !ts.isImportDeclaration(node))
  .map(node => node.getFullText(parsed))
  .join('\n');
const { outputText } = ts.transpileModule(withoutImports, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
const admin = 'chrome-extension://test/options.html';
function fixture(initial = [], settings = {}, faults = {}) {
  const tabs = new Map(
    initial.map(tab => [
      tab.id,
      { pinned: false, active: false, index: tab.id, windowId: 1, ...tab },
    ]),
  );
  const calls = [];
  let nextId = 100;
  let currentWindow = 1;
  const get = id => {
    if (!tabs.has(id)) throw new Error('Tab closed');
    return tabs.get(id);
  };
  const browser = {
    runtime: { getURL: path => `chrome-extension://test${path}` },
    windows: { getCurrent: async () => ({ id: currentWindow }) },
    tabs: {
      query: async query =>
        [...tabs.values()]
          .filter(t => query.windowId === undefined || t.windowId === query.windowId)
          .map(t => ({ ...t })),
      get: async id => ({ ...get(id) }),
      create: async props => {
        const tab = { id: nextId++, index: 0, ...props };
        tabs.set(tab.id, tab);
        calls.push(['create', tab.id]);
        return { ...tab };
      },
      update: async (id, props) => {
        calls.push(['update', id, props]);
        if (faults.closeOnPin && 'pinned' in props) {
          faults.closeOnPin = false;
          tabs.delete(id);
          throw new Error('Tab closed');
        }
        const applied = { ...props };
        if (faults.ignorePin) delete applied.pinned;
        Object.assign(get(id), applied);
        return { ...get(id) };
      },
      move: async id => {
        calls.push(['move', id]);
        if (faults.move) throw new Error('Move unsupported');
        return get(id);
      },
      reload: async id => {
        get(id);
        calls.push(['reload', id]);
      },
      remove: async ids => {
        for (const id of Array.isArray(ids) ? ids : [ids]) {
          tabs.delete(id);
          calls.push(['remove', id]);
        }
      },
    },
  };
  const saved = [];
  const sandbox = {
    exports: {},
    browser,
    URL,
    setTimeout,
    console: { error: (...args) => calls.push(['error', ...args]) },
    debounce: fn => fn,
    ENUM_SETTINGS_PROPS: new Proxy({}, { get: (_, name) => name }),
    settingsUtils: {
      getSettings: async () => ({
        AUTO_PIN_ADMIN_TAB: true,
        CLOSE_TABS_AFTER_SEND_TABS: true,
        ...settings,
      }),
    },
    tabListUtils: {
      createTabs: async rows => {
        saved.push(...rows);
        currentWindow = 2;
        return { tagId: 'tag', groupId: 'group' };
      },
    },
    objectToUrlParams: obj => new URLSearchParams(obj).toString(),
  };
  vm.runInNewContext(outputText, sandbox);
  sandbox.exports.initializeAdminPageCoordinator();
  return { api: sandbox.exports, tabs, calls, saved };
}

const f = fixture(
  [
    { id: 1, url: `${admin}#/settings`, active: true },
    { id: 2, url: `${admin}#/home`, pinned: true },
    { id: 3, url: 'https://example.com' },
    { id: 4, url: admin, windowId: 2 },
  ],
  {},
  { move: true },
);
await f.api.openAdminRoutePage({ path: '/home', query: { tagId: 't' } }, true, 1, true);
assert.deepEqual([...f.tabs.keys()], [2, 3, 4]);
assert.equal(f.tabs.get(2).pinned, true);
assert(f.calls.some(c => c[0] === 'reload' && c[1] === 2));
assert(
  f.calls.findIndex(c => c[0] === 'update') < f.calls.findIndex(c => c[0] === 'move'),
);

const concurrent = fixture();
await Promise.all(
  Array.from({ length: 8 }, () =>
    concurrent.api.openAdminRoutePage({ path: '/home' }, true, 1),
  ),
);
assert.equal(concurrent.tabs.size, 1);
assert.equal(concurrent.calls.filter(c => c[0] === 'create').length, 1);
assert.equal([...concurrent.tabs.values()][0].pinned, true);

const disabled = fixture([{ id: 1, url: admin, pinned: true }], {
  AUTO_PIN_ADMIN_TAB: false,
});
await disabled.api.openAdminRoutePage({ path: '/home' }, true, 1);
assert.equal(disabled.tabs.get(1).pinned, false);

const failed = fixture([{ id: 1, url: admin }], {}, { ignorePin: true });
await assert.rejects(
  failed.api.openAdminRoutePage({ path: '/home' }, true, 1),
  /pinned state/,
);
assert.equal(failed.tabs.size, 1);
assert.equal(failed.calls.filter(c => c[0] === 'create').length, 0);

const closed = fixture([{ id: 1, url: admin }], {}, { closeOnPin: true });
await closed.api.openAdminRoutePage({ path: '/home' }, true, 1);
assert.equal(closed.tabs.size, 1);
assert.equal(closed.calls.filter(c => c[0] === 'create').length, 1);

const empty = fixture([], { OPEN_ADMIN_TAB_AFTER_SEND_TABS: false });
await empty.api.default.sendAllTabs();
assert.equal(empty.tabs.size, 1);

const command = fixture([
  { id: 1, url: 'chrome-extension://test/command.html?action=sendAllTabs' },
  { id: 2, url: 'https://example.com' },
  { id: 3, pendingUrl: `${admin}#/settings` },
  { id: 4, url: `${admin}#/home` },
  { id: 5, url: 'https://other-window.example', windowId: 2 },
]);
await command.api.sendAllTabsFromCommandPage(1, 1);
await new Promise(resolve => setTimeout(resolve, 60));
assert.deepEqual(
  command.saved.map(t => t.id),
  [2],
);
assert(!command.tabs.has(1));
assert(!command.tabs.has(2));
assert(command.tabs.has(5));
assert.equal([...command.tabs.values()].filter(t => t.windowId === 1).length, 1);
assert.equal([...command.tabs.values()].find(t => t.windowId === 1).pinned, true);

const failedCommand = fixture(
  [
    { id: 1, url: 'chrome-extension://test/command.html?action=sendAllTabs' },
    { id: 2, url: admin },
  ],
  {},
  { ignorePin: true },
);
await assert.rejects(failedCommand.api.sendAllTabsFromCommandPage(1, 1));
assert(failedCommand.tabs.has(1));

const cleanup = fixture([
  { id: 1, url: admin, pinned: true },
  { id: 2, pendingUrl: `${admin}#/settings` },
  { id: 3, url: 'https://example.com/options.html', pinned: true },
  { id: 4, url: 'chrome-extension://another/options.html', pinned: true },
]);
await cleanup.api.deduplicateAdminPages(1);
assert.deepEqual([...cleanup.tabs.keys()], [1, 3, 4]);
// A failed operation must not poison the next operation in this window.
failed.tabs.get(1).pinned = true;
await failed.api.openAdminRoutePage({ path: '/home' }, true, 1);
assert.equal(failed.tabs.size, 1);

console.log('Admin tab regression scenarios passed.');
