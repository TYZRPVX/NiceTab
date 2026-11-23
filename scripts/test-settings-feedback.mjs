// Run with node scripts/test-settings-feedback.mjs. No browser profile is touched.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { isEqual } from 'lodash-es';

function load(file, globals = {}) {
  const source = fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
  const parsed = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
  const imports = {};
  for (const node of parsed.statements) {
    if (ts.isImportDeclaration(node)) {
      for (const item of node.importClause?.namedBindings?.elements || []) imports[item.name.text] = [];
    }
  }
  const body = parsed.statements.filter(node => !ts.isImportDeclaration(node))
    .map(node => node.getFullText(parsed)).join('\n').replaceAll('import.meta.env.FIREFOX', 'false');
  const { outputText } = ts.transpileModule(body, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
  });
  const context = { exports: {}, console, ...imports, ...globals };
  vm.runInNewContext(outputText, context);
  return context.exports;
}
const { normalizeLanguage } = load('entrypoints/common/locale/normalize.ts');
for (const [input, expected] of [
  ['en-SG', 'en-US'], ['en-GB', 'en-US'], ['zh-Hans-SG', 'zh-CN'],
  ['zh-Hant-HK', 'zh-TW'], ['zh-TW', 'zh-TW'], ['zh-HK', 'zh-TW'],
  ['zh_CN', 'zh-CN'], ['fr-FR', 'en-US'], ['zh--invalid', 'en-US'], [null, 'en-US'], [42, 'en-US'], ['', 'en-US'],
]) assert.equal(normalizeLanguage(input), expected);

const data = new Map();
const watchers = new Map();
let writes = 0;
const storage = {
  getItem: async key => structuredClone(data.get(key) ?? null),
  setItem: async (key, value) => {
    assert.ok(++writes < 30, 'storage feedback loop');
    data.set(key, structuredClone(value));
    for (const callback of watchers.get(key) || []) callback(structuredClone(value));
  },
};
const enumSettings = new Proxy({}, { get: (_, key) => key.toLowerCase().replace(/_([a-z])/g, (_, c) => c.toUpperCase()) });
const SettingsUtils = load('entrypoints/common/storage/settingsUtils.ts', {
  ENUM_SETTINGS_PROPS: enumSettings, normalizeLanguage, isEqual, storage,
  navigator: { language: 'en-SG' }, defaultLanguage: 'en-US', defaultThemeType: 'auto',
}).default;
const settingsUtils = new SettingsUtils();
assert.equal((await settingsUtils.getSettings()).language, 'en-US');
assert.equal(writes, 0, 'first read must not persist defaults');
data.set('local:settings', { language: 'en-SG', customField: 'preserved', themeType: 'auto' });
assert.equal((await settingsUtils.getSettings()).language, 'en-US');
assert.equal(writes, 0, 'legacy normalization must be read-only');
await settingsUtils.setSettings({ language: 'zh-Hans-SG' });
assert.equal(data.get('local:settings').language, 'zh-CN');
assert.equal(data.get('local:settings').customField, 'preserved');
await settingsUtils.setSettings({ language: 'zh-CN' });
assert.equal(writes, 1, 'identical saves must be skipped');

const ThemeUtils = load('entrypoints/common/storage/themeUtils.ts', {
  isEqual, storage, PRIMARY_COLOR: '#123456', THEME_COLORS: [{ color: '#123456' }, { color: '#654321' }],
}).default;
const themeUtils = new ThemeUtils();
data.set('local:theme', { colorPrimary: 'invalid', extra: 'kept' });
assert.equal((await themeUtils.getThemeData()).colorPrimary, '#123456');
assert.equal(writes, 1, 'theme reads must not repair storage');
await themeUtils.setThemeData({ colorPrimary: '#123456' });
await themeUtils.setThemeData({ colorPrimary: '#123456' });
assert.equal(writes, 2);

// Run the real Root initialization, watcher callbacks and public action handlers.
function mountRoot(pageContext) {
  const effects = [], cleanups = [], contexts = [], applied = [];
  const GlobalContext = { Provider: 'context-provider' };
  const React = { createElement: (type, props, ...children) => {
    if (type === GlobalContext.Provider) contexts.push(props.value);
    return { type, props, children };
  }};
  const watch = key => callback => {
    const list = watchers.get(key) || new Set();
    watchers.set(key, list); list.add(callback);
    return () => list.delete(callback);
  };
  const Root = load('entrypoints/common/components/Root.tsx', {
    React, useState: initial => [initial, value => applied.push(value)],
    useMemo: fn => fn(), useEffect: fn => effects.push(fn),
    GlobalContext, settingsUtils, themeUtils,
    useAntdLocale: () => ({ locale: 'en-US', changeLocale: value => applied.push(value) }),
    useCustomLocale: () => ({ locale: 'en-US', messages: {}, changeLocale: value => applied.push(value) }),
    useThemeTypeConfig: () => ({ themeType: 'auto', themeTypeConfig: { type: 'light' }, changeThemeType: value => applied.push(value) }),
    message: { useMessage: () => [{}, null] }, withMessageIcons: value => value,
    UIIcons: {}, ConfigProvider: 'config', IntlProvider: 'intl', theme: {},
    PRIMARY_COLOR: '#123456', THEME_COLORS: [], defaultLanguage: 'en-US',
    document: { documentElement: {} },
    browser: { runtime: { getManifest: () => ({ version: 'test' }), onMessage: { addListener() {}, removeListener() {} } } },
    initSettingsStorageListener: watch('local:settings'), initThemeStorageListener: watch('local:theme'),
  }).default;
  Root({ pageContext, children: null });
  for (const effect of effects) { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); }
  return { actions: contexts[0], applied, unmount: () => cleanups.forEach(fn => fn()) };
}
const settle = async () => { for (let i = 0; i < 15; i++) await Promise.resolve(); };
const pages = ['optionsPage', 'popupPage', 'contentScriptPage'].map(mountRoot);
await settle();
assert.equal(writes, 2, 'mounting multiple pages must not write');
await pages[0].actions.setLocale('en-SG');
await settle();
assert.equal(writes, 3, 'one action must produce one write across all watchers');
for (const page of pages) assert.ok(page.applied.includes('en-US'));
await pages[0].actions.setThemeType('dark');
await settle();
assert.equal(writes, 4);
for (const page of pages) assert.ok(page.applied.includes('dark'));
await pages[0].actions.setThemeType('dark');
assert.equal(writes, 4);
await settingsUtils.setSettings({ language: 'zh-Hant-HK', customField: 'imported' });
await settle();
assert.equal(writes, 5, 'external import/sync save must not cause watcher writes');
for (const page of pages) assert.ok(page.applied.includes('zh-TW'));
assert.equal(data.get('local:settings').customField, 'imported');
await pages[0].actions.setThemeData({ colorPrimary: '#654321' });
await settle();
assert.equal(writes, 6);
for (const page of pages) page.unmount();
for (const callbacks of watchers.values()) assert.equal(callbacks.size, 0);

// Exercise real locale/theme hooks, including the OS theme event, with pure React stubs.
const hookEffects = [], mediaListeners = [];
const config = { light: { type: 'light' }, dark: { type: 'dark' }, auto: { type: 'light' } };
const hooks = load('entrypoints/common/hooks/global.ts', {
  normalizeLanguage, settingsUtils, themeUtils, createContext: value => value,
  useState: value => [value, () => {}], useMemo: fn => fn(), useEffect: fn => hookEffects.push(fn),
  mitt: () => ({}), defaultLanguage: 'en-US', defaultThemeType: 'auto', PRIMARY_COLOR: '#123456',
  THEME_TYPE_CONFIG: config, antdMap: { 'en-US': {}, 'zh-CN': {}, 'zh-TW': {} }, customMap: {},
  window: { matchMedia: () => ({ matches: true, addEventListener: (_, fn) => mediaListeners.push(fn), removeEventListener() {} }) },
});
await hooks.useAntdLocale().changeLocale('en-SG');
await hooks.useCustomLocale().changeLocale('en-SG');
await hooks.useThemeTypeConfig().changeThemeType('auto');
for (const effect of hookEffects) effect();
data.get('local:settings').themeType = 'auto';
for (const listener of mediaListeners) listener();
await settle();
assert.equal(writes, 6, 'hooks and OS theme changes must not persist');
// Failed theme persistence must not publish an unsaved value to callers.
const oldTheme = themeUtils.themeData;
const originalSetItem = storage.setItem;
storage.setItem = async () => { throw new Error('storage failed'); };
await assert.rejects(themeUtils.setThemeData({ colorPrimary: '#123456' }), /storage failed/);
assert.equal(themeUtils.themeData, oldTheme);
storage.setItem = originalSetItem;

console.log('Settings feedback regression tests passed.');
