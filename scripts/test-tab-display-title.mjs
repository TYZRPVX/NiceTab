import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { isDeepStrictEqual } from 'node:util';

// Exercise production TypeScript without bundling React or accessing browser APIs.
function loadSource(
  file,
  requireModule = () => {
    throw new Error('Unexpected import');
  },
) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function('exports', 'require', outputText)(exports, requireModule);
  return exports;
}

const urlUtils = loadSource('../entrypoints/common/utils/url.ts');
const { resolveTabDisplayTitle, matchesTabSearch } = loadSource(
  '../entrypoints/common/utils/tabDisplayTitle.ts',
  name => {
    assert.equal(name, './url');
    return urlUtils;
  },
);
const tab = Object.freeze({
  title: 'Original Zhihu Article',
  url: 'https://www.zhihu.com/question/123',
});
const rule = Object.freeze({
  url: 'zhihu.com',
  title: '知乎自定义名称',
  mode: 'contains',
});
const rules = Object.freeze([rule]);
assert.equal(resolveTabDisplayTitle(tab, rules), rule.title);
assert.equal(resolveTabDisplayTitle(tab, []), tab.title);
assert.equal(resolveTabDisplayTitle({ url: tab.url }, []), tab.url);
assert.equal(resolveTabDisplayTitle({}, rules), '');
assert.equal(
  resolveTabDisplayTitle(tab, [rule, { ...rule, title: 'Second' }]),
  rule.title,
);
assert.equal(
  resolveTabDisplayTitle(tab, [
    { ...rule, title: '' },
    { ...rule, url: '' },
    { ...rule, mode: 'regex', url: '[' },
    rule,
  ]),
  rule.title,
);
for (const [mode, pattern] of [
  ['equal', tab.url],
  ['startsWith', 'https://www.zhihu.com/'],
  ['endsWith', '/123'],
  ['regex', 'zhihu\\.com'],
  ['wildcard', '*zhihu.com/*'],
]) {
  assert.equal(
    resolveTabDisplayTitle(tab, [{ ...rule, mode, url: pattern }]),
    rule.title,
  );
}
assert.equal(resolveTabDisplayTitle(tab, [{ ...rule, url: 'example.com' }]), tab.title);
for (const text of [' ORIGINAL ', '知乎自定义', 'zhihu.com', '']) {
  assert.equal(matchesTabSearch(tab, text, rules), true);
}
assert.equal(matchesTabSearch(tab, 'unmatched', rules), false);
assert.equal(matchesTabSearch(tab, '知乎自定义', []), false);
assert.equal(resolveTabDisplayTitle(tab, [{ ...rule, title: 'Updated' }]), 'Updated');
assert.equal(tab.title, 'Original Zhihu Article');

const {
  leisurePageTitlePresets,
  mergeLeisurePageTitlePresets,
  saveLeisurePageTitlePresets,
} = loadSource('../entrypoints/options/settings/pageTitlePresets.ts');
assert.equal(leisurePageTitlePresets.length, 22);
for (const preset of leisurePageTitlePresets) {
  const pattern = new RegExp(preset.url);
  const domain = preset.url.split(')*')[1].split('(?::')[0].replaceAll('\\.', '.');
  for (const url of [
    `https://${domain}`,
    `http://${domain}/`,
    `https://www.${domain}/article/123`,
    `https://a.b.${domain}:8080/path?title=123#part`,
    `https://${domain}?q=test`,
  ]) {
    assert.equal(pattern.test(url), true, url);
    assert.equal(
      resolveTabDisplayTitle({ title: 'Sensitive title', url }, [preset]),
      preset.title,
    );
  }
  for (const url of [
    `https://${domain}.example.com/`,
    `https://fake${domain}/`,
    `https://example.com/?url=https://${domain}/`,
    `https://example.com/${domain}`,
    `https://${domain}@example.com/`,
    `ftp://${domain}/`,
  ])
    assert.equal(pattern.test(url), false, url);
}
const customized = Object.freeze({ ...leisurePageTitlePresets[0], title: 'My Zhihu' });
const existing = Object.freeze([rule, customized]);
const merged = mergeLeisurePageTitlePresets(existing);
assert.equal(merged.addedCount, 21);
assert.deepEqual(merged.rules.slice(0, 2), existing);
assert.equal(resolveTabDisplayTitle(tab, merged.rules), rule.title);
assert.equal(
  resolveTabDisplayTitle(tab, mergeLeisurePageTitlePresets([customized]).rules),
  customized.title,
);
assert.equal(mergeLeisurePageTitlePresets(merged.rules).addedCount, 0);
assert.deepEqual(mergeLeisurePageTitlePresets(merged.rules).rules, merged.rules);
// Omitted mode is effectively equal, and does not suppress a regex preset.
assert.equal(
  mergeLeisurePageTitlePresets([{ ...customized, mode: undefined }]).addedCount,
  22,
);

// Import persists title drafts only, using the latest stored settings.
const persisted = Object.freeze({
  themeType: 'dark',
  language: 'en-US',
  linkTemplate: 'saved',
  pageTitleConfig: [],
});
let saved;
const result = await saveLeisurePageTitlePresets(
  existing,
  async () => persisted,
  async settings => {
    saved = settings;
  },
);
assert.deepEqual(saved, { ...persisted, pageTitleConfig: result.rules });
assert.deepEqual(existing, [rule, customized]);
assert.deepEqual(persisted.pageTitleConfig, []);
await assert.rejects(
  saveLeisurePageTitlePresets(
    existing,
    async () => persisted,
    async () => {
      throw new Error('storage failed');
    },
  ),
  /storage failed/,
);
assert.equal(mergeLeisurePageTitlePresets(existing).addedCount, 21);

// Execute the actual settings callback with form/storage doubles, without a browser.
function sourceExpression(file, predicate) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let expression;
  function visit(node) {
    if (predicate(node)) expression = node;
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.ok(expression, `Missing callback in ${file}`);
  return ts.transpileModule(`const callback = ${expression.getText(ast)};`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText;
}
const importCallbackSource = sourceExpression(
  '../entrypoints/options/settings/index.tsx',
  node =>
    ts.isArrowFunction(node) &&
    ts.isVariableDeclaration(node.parent) &&
    node.parent.name.getText() === 'handleImportPresets',
);
function importHarness({ invalid = false, failSave = false } = {}) {
  const state = {
    values: { ...persisted, themeType: 'light', pageTitleConfig: [...existing] },
    baseline: persisted,
    messages: [],
    loading: false,
    dirty: false,
    cancelled: 0,
    writes: 0,
  };
  const scope = {
    importInProgress: { current: false },
    setImportingPresets: value => {
      state.loading = value;
    },
    form: {
      validateFields: async (names, options) => {
        assert.deepEqual(names, [['pageTitleConfig']]);
        assert.equal(options.recursive, true);
        if (invalid) throw new Error('invalid title rule');
      },
      getFieldValue: name => state.values[name],
      getFieldsValue: () => state.values,
      setFieldsValue: values => {
        state.values = { ...state.values, ...values };
      },
    },
    saveLeisurePageTitlePresets,
    settingsUtils: { getSettings: async () => persisted },
    NiceGlobalContext: {
      setSettings: async settings => {
        state.writes++;
        assert.equal(settings.themeType, 'dark');
        if (failSave) throw new Error('storage failed');
      },
    },
    initialFormValues: persisted,
    setInitialFormValues: values => {
      state.baseline = values;
    },
    onValuesChange: {
      cancel: () => {
        state.cancelled++;
      },
    },
    setHasChanged: value => {
      state.dirty = value;
    },
    isEqual: isDeepStrictEqual,
    messageApi: {
      success: value => state.messages.push(['success', value]),
      error: value => state.messages.push(['error', value]),
    },
    $fmt: value => value,
  };
  const callback = new Function(
    ...Object.keys(scope),
    `${importCallbackSource}\nreturn callback;`,
  )(...Object.values(scope));
  return { state, callback, scope };
}
const imported = importHarness();
const importing = imported.callback();
assert.equal(imported.state.loading, true);
await imported.callback(); // A second click during saving is ignored.
await importing;
assert.equal(imported.state.loading, false);
assert.equal(imported.state.writes, 1);
assert.equal(imported.state.values.themeType, 'light'); // Draft is retained.
assert.equal(imported.state.baseline.themeType, 'dark'); // It remains unsaved.
assert.equal(imported.state.dirty, true);
assert.deepEqual(imported.state.values.pageTitleConfig, merged.rules);
assert.deepEqual(imported.state.baseline.pageTitleConfig, merged.rules);
assert.equal(imported.state.cancelled, 1);
await imported.callback();
assert.equal(imported.state.messages.at(-1)[1], 'settings.pageTitleConfig.presetsExist');
const titlesOnly = importHarness();
titlesOnly.state.values.themeType = persisted.themeType;
await titlesOnly.callback();
assert.equal(titlesOnly.state.dirty, false);
for (const options of [{ invalid: true }, { failSave: true }]) {
  const attempt = importHarness(options);
  const before = structuredClone(attempt.state.values);
  await attempt.callback();
  assert.deepEqual(attempt.state.values, before);
  assert.equal(attempt.state.baseline, persisted);
  assert.equal(attempt.state.loading, false);
  assert.equal(attempt.scope.importInProgress.current, false);
  assert.equal(attempt.state.writes, options.invalid ? 0 : 1);
  assert.equal(attempt.state.messages.length, options.invalid ? 0 : 1);
}

const watcherSource = sourceExpression(
  '../entrypoints/common/components/Root.tsx',
  node =>
    ts.isArrowFunction(node) &&
    ts.isCallExpression(node.parent) &&
    node.parent.expression.getText() === 'initSettingsStorageListener',
);
let reloaded = 0;
let displayed;
const watcherScope = {
  isEqual: isDeepStrictEqual,
  settingsUtils: { initialSettings: {}, settings: persisted },
  pageContext: 'optionsPage',
  setPageTitleConfig: rules => {
    displayed = rules;
  },
  initData: () => {
    reloaded++;
  },
};
const watcher = new Function(
  ...Object.keys(watcherScope),
  `${watcherSource}\nreturn callback;`,
)(...Object.values(watcherScope));
watcher(saved, persisted);
assert.deepEqual(displayed, saved.pageTitleConfig);
assert.equal(reloaded, 0); // Title-only updates do not reinitialize the settings form.
watcher(saved, saved);
assert.equal(reloaded, 0);
watcher({ ...saved, themeType: 'light' }, saved);
assert.equal(reloaded, 1);

// A failed storage write must not replace the in-memory settings either.
const settingsSource = fs.readFileSync(
  new URL('../entrypoints/common/storage/settingsUtils.ts', import.meta.url),
  'utf8',
);
const settingsAst = ts.createSourceFile(
  'settingsUtils.ts',
  settingsSource,
  ts.ScriptTarget.Latest,
  true,
);
const settingsClass = settingsAst.statements.find(ts.isClassDeclaration);
const setter = settingsClass.members.find(
  node =>
    ts.isMethodDeclaration(node) && node.name.getText(settingsAst) === 'setSettings',
);
const setterSource = ts.transpileModule(
  `const methods = { ${setter.getText(settingsAst)} };`,
  {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  },
).outputText;
const setSettings = new Function(
  'storage',
  `${setterSource}\nreturn methods.setSettings;`,
)({
  setItem: async () => {
    throw new Error('storage failed');
  },
});
const settingsInstance = {
  settings: persisted,
  initialSettings: {},
  storageKey: 'local:settings',
};
await assert.rejects(setSettings.call(settingsInstance, saved), /storage failed/);
assert.equal(settingsInstance.settings, persisted);

for (const file of [
  '../entrypoints/background/index.ts',
  '../entrypoints/common/tabs.ts',
]) {
  const source = fs.readFileSync(new URL(file, import.meta.url), 'utf8');
  assert.doesNotMatch(source, /setPageTitle|executeScript|document\.title/);
}
const config = fs.readFileSync(new URL('../wxt.config.ts', import.meta.url), 'utf8');
assert.doesNotMatch(config, /['"]scripting['"]/);
console.log(
  'PASS: display-only rules, domain boundaries, preset merge/idempotency, selective saving/failure, search and injection removal',
);
