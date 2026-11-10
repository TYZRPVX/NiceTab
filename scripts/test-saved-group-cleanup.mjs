// Run with: node scripts/test-saved-group-cleanup.mjs
// Production TypeScript with in-memory storage; does not touch a browser profile.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import dayjs from 'dayjs';

function load(path, globals) {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const parsed = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const body = parsed.statements
    .filter(node => !ts.isImportDeclaration(node))
    .map(node => node.getFullText(parsed))
    .join('\n');
  const { outputText } = ts.transpileModule(body, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const sandbox = { exports: {}, console, dayjs, ...globals };
  vm.runInNewContext(outputText, sandbox);
  return sandbox.exports;
}
const now = new Date('2026-11-10T12:00:00Z').valueOf();
const group = (id, days = 90, extra = {}) => ({
  groupId: id,
  groupName: id,
  createTime: dayjs(now).subtract(days, 'day').toISOString(),
  tabList: [{ tabId: `${id}-tab`, url: 'https://example.com' }],
  ...extra,
});
const tag = (id, groups, extra = {}) => ({
  tagId: id,
  tagName: id,
  createTime: '',
  groupList: groups,
  ...extra,
});
const plain = value => JSON.parse(JSON.stringify(value));
function fixture(initial, settings = {}, hooks = {}) {
  let data = plain(initial);
  let reads = 0;
  const archive = [];
  const writes = [];
  const Store = {
    settingsUtils: { getSettings: async () => settings },
    tabListUtils: {
      storageKey: 'tabs',
      setTagList: async list => {
        writes.push('source');
        data = plain(list);
      },
    },
    recycleBinUtils: {
      addTags: async tags => {
        if (hooks.archive) await hooks.archive(data, settings);
        archive.push(...plain(tags));
        writes.push('archive');
      },
    },
  };
  const storage = {
    getItem: async () => {
      reads++;
      if (hooks.read) hooks.read(reads, data);
      return plain(data);
    },
  };
  const api = load('entrypoints/common/storage/savedGroupCleanup.ts', { Store, storage });
  return {
    api,
    archive,
    writes,
    get data() {
      return data;
    },
  };
}

const f = fixture([
  tag('ordinary', [
    group('boundary'),
    group('recent', 89),
    group('star', 100, { isStarred: true }),
    group('lock', 100, { isLocked: true }),
    group('invalid', 100, { createTime: 'invalid' }),
    group('missing', 100, { createTime: '' }),
    group('future', -1),
  ]),
  tag('locked-category', [group('protected', 100)], { isLocked: true }),
  tag('empty-after-cleanup', [group('old', 91)]),
]);
assert.equal(await f.api.cleanupSavedGroups(now), 2);
assert.deepEqual(f.writes, ['archive', 'source']);
assert.deepEqual(
  f.data[0].groupList.map(g => g.groupId),
  ['recent', 'star', 'lock', 'invalid', 'missing', 'future'],
);
assert.equal(f.data[1].groupList.length, 1);
assert.equal(f.data[2].groupList.length, 0);
assert.equal(await f.api.cleanupSavedGroups(now), 0);

for (const [settings, expected] of [
  [{ autoCleanupSavedGroups: false }, 0],
  [{ savedGroupRetentionDays: 30 }, 1],
  [{ savedGroupRetentionDays: 180 }, 0],
]) {
  const f = fixture([tag('t', [group('g')])], settings);
  assert.equal(await f.api.cleanupSavedGroups(now), expected);
}
assert.equal(f.api.savedGroupRetentionDays({ savedGroupRetentionDays: NaN }), 90);
assert.equal(f.api.savedGroupRetentionDays({ savedGroupRetentionDays: 9999 }), 3650);
assert.equal(f.api.savedGroupRetentionDays({ savedGroupRetentionDays: 0 }), 1);

const failed = fixture(
  [tag('t', [group('g')])],
  {},
  {
    archive: async () => {
      throw new Error('disk failure');
    },
  },
);
await assert.rejects(failed.api.cleanupSavedGroups(now), /disk failure/);
assert.equal(failed.data[0].groupList.length, 1);
assert.deepEqual(failed.writes, []);

const edited = fixture(
  [tag('t', [group('g')])],
  {},
  {
    read: (n, data) => {
      if (n === 2) data[0].groupList[0].tabList.push({ tabId: 'new' });
    },
  },
);
assert.equal(await edited.api.cleanupSavedGroups(now), 0);
assert.equal(edited.archive.length, 0);

const protectedDuringArchive = fixture(
  [tag('t', [group('g')])],
  {},
  {
    archive: async data => {
      data[0].isLocked = true;
    },
  },
);
assert.equal(await protectedDuringArchive.api.cleanupSavedGroups(now), 0);
assert.equal(protectedDuringArchive.data[0].groupList.length, 1);
assert.deepEqual(protectedDuringArchive.writes, ['archive']);
const disabledDuringArchive = fixture(
  [tag('t', [group('g')])],
  {},
  {
    archive: async (_data, settings) => {
      settings.autoCleanupSavedGroups = false;
    },
  },
);
assert.equal(await disabledDuringArchive.api.cleanupSavedGroups(now), 0);
assert.equal(disabledDuringArchive.data[0].groupList.length, 1);

let unblock;
const busy = fixture(
  [tag('t', [group('g')])],
  {},
  {
    archive: () =>
      new Promise(resolve => {
        unblock = resolve;
      }),
  },
);
const first = busy.api.cleanupSavedGroups(now);
while (!unblock) await new Promise(resolve => setImmediate(resolve));
assert.equal(await busy.api.cleanupSavedGroups(now), 0);
unblock();
assert.equal(await first, 1);

// Exercise the shared restore path, including merges into an existing group.
const restoredAt = dayjs(now).format('YYYY-MM-DD HH:mm:ss');
const recycle = load('entrypoints/common/storage/recycleBinUtils.ts', {
  TabListUtils: class {},
  newCreateTime: () => restoredAt,
}).default;
const instance = Object.create(recycle.prototype);
const old = group('g', 100, { recycleTime: 'old' });
let restored = instance.recoverTabGroupsBasic([], tag('t', []), [old]);
assert.equal(restored[0].groupList[0].createTime, restoredAt);
assert.equal('recycleTime' in restored[0].groupList[0], false);
assert.equal(
  f.api.isExpiredSavedGroup(restored[0], restored[0].groupList[0], 90, now),
  false,
);
restored = instance.recoverTabGroupsBasic([tag('t', [group('g', 100)])], tag('t', []), [
  old,
]);
assert.equal(restored[0].groupList[0].createTime, restoredAt);
assert.equal(restored[0].groupList[0].tabList.length, 2);

// Both persistence methods must wait for storage and propagate write failures.
for (const [file, globals] of [
  ['recycleBinUtils.ts', { TabListUtils: class {} }],
  [
    'tabListUtils.ts',
    { ENUM_SETTINGS_PROPS: {}, normalizeLegacyGeneratedNames: () => {} },
  ],
]) {
  let complete;
  const Class = load(`entrypoints/common/storage/${file}`, {
    ...globals,
    storage: {
      setItem: () =>
        new Promise(resolve => {
          complete = resolve;
        }),
    },
  }).default;
  const object = Object.create(Class.prototype);
  object.setCountInfo = () => {};
  let settled = false;
  const write = object.setTagList([tag('t', [])]).then(() => {
    settled = true;
  });
  await Promise.resolve();
  assert.equal(settled, false);
  complete();
  await write;
  assert.equal(settled, true);
}

// Alarm survives worker restarts, resets on relevant settings changes, and clears on disable.
const alarms = new Map();
let creates = 0;
const browser = {
  alarms: {
    get: async name => alarms.get(name),
    create: async (name, info) => {
      creates++;
      alarms.set(name, info);
    },
    clear: async name => alarms.delete(name),
  },
};
const CommonAlarm = load('entrypoints/common/alarms/utils.ts', { browser }).default;
let settings = {};
const {
  autoCleanupSavedGroupsAlarm: scheduler,
  AUTO_CLEANUP_SAVED_GROUPS_ALARM_KEY: alarmKey,
} = load('entrypoints/common/alarms/autoCleanupSavedGroupsAlarm.ts', {
  browser,
  CommonAlarm,
  settingsUtils: { getSettings: async () => settings },
});
await scheduler.create();
assert.deepEqual(plain(alarms.get(alarmKey)), {
  delayInMinutes: 1,
  periodInMinutes: 1440,
});
await scheduler.create();
assert.equal(creates, 1);
settings = { savedGroupRetentionDays: 30 };
await scheduler.checkReset(settings, {});
assert.equal(creates, 2);
settings = { autoCleanupSavedGroups: false };
await scheduler.checkReset(settings, {});
assert.equal(alarms.size, 0);
settings = { autoCleanupSavedGroups: true };
await scheduler.checkReset(settings, { autoCleanupSavedGroups: false });
assert.equal(alarms.size, 1);
for (const createTime of ['2026-02-30 00:00:00', '2026-02-10 30:00:00']) {
  assert.equal(
    f.api.isExpiredSavedGroup(tag('t', []), group('g', 100, { createTime }), 90, now),
    false,
  );
}
for (const [file, globals] of [
  ['recycleBinUtils.ts', { TabListUtils: class {} }],
  [
    'tabListUtils.ts',
    { ENUM_SETTINGS_PROPS: {}, normalizeLegacyGeneratedNames: () => {} },
  ],
]) {
  const Class = load(`entrypoints/common/storage/${file}`, {
    ...globals,
    storage: {
      setItem: async () => {
        throw new Error('write failed');
      },
    },
  }).default;
  const object = Object.create(Class.prototype);
  object.setCountInfo = () => {};
  await assert.rejects(object.setTagList([tag('t', [])]), /write failed/);
}
console.log('Saved-group cleanup regression scenarios passed.');
