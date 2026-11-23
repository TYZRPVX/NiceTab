// Exercise the real mount function with delayed React ref attachment.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

const file = 'entrypoints/content/mountUi.tsx';
const source = fs.readFileSync(file, 'utf8');
const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const body = ast.statements.filter(node => !ts.isImportDeclaration(node))
  .map(node => node.getFullText(ast)).join('\n');
const { outputText } = ts.transpileModule(body, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.React },
});

function fixture({ mountError = false, invalid = false } = {}) {
  let tree, options, mounted, uiRemoves = 0, unmounts = 0, opens = 0, removed = 0;
  const element = () => ({ append() {}, remove() {}, style: {} });
  const exports = {};
  const App = 'App', Root = 'Root';
  const context = {
    exports, App, Root, resetCss: '', contentCss: '', iconCss: '',
    StyleProvider: 'StyleProvider', StyleSheetManager: 'StyleSheetManager',
    ContentGlobalContext: { Provider: 'ContentProvider' },
    document: { createElement: element },
    React: { createElement: (type, props, ...children) => ({ type, props, children }) },
    ReactDOM: { createRoot: () => ({ render: value => {
      tree = value; if (mountError) throw Error('React mount failed');
    }, unmount: () => unmounts++ }) },
    flushSync: fn => fn(),
    createShadowRootUi: async (_ctx, config) => {
      options = config;
      return { mount: () => { mounted = config.onMount(element(), {}, element()); },
        remove: () => { uiRemoves++; config.onRemove(mounted); } };
    },
  };
  vm.runInNewContext(outputText, context);
  const find = (node, type) => node?.type === type ? node : node?.children?.map(child => find(child, type)).find(Boolean);
  const promise = exports.mountContentUi({ isInvalid: invalid }, () => removed++);
  return { promise,
    ready: () => find(tree, App).props.ref({ openGlobalSearch: () => opens++, refreshGlobalSearch() {}, openSendTarget() {}, showCallbackMessage() {} }),
    failInit: () => find(tree, Root).props.onInitializationError(Error('Settings unavailable')),
    invalidate: () => options.onRemove(mounted),
    stats: () => ({ opens, uiRemoves, unmounts, removed }),
  };
}
const settle = () => new Promise(resolve => setImmediate(resolve));
const first = fixture();
let resolved = false;
first.promise.then(() => { resolved = true; });
await settle();
assert.equal(resolved, false, 'UI must wait for Root settings and the App ref');
first.ready();
const ui = await first.promise;
ui.openGlobalSearch();
assert.equal(first.stats().opens, 1, 'First action reaches the ready component');
ui.remove();
assert.equal(first.stats().unmounts, 1);
for (const kind of ['mount', 'settings', 'invalidation', 'already-invalid']) {
  const f = fixture({ mountError: kind === 'mount', invalid: kind === 'already-invalid' });
  const rejected = assert.rejects(f.promise);
  await settle();
  if (kind === 'settings') f.failInit();
  if (kind === 'invalidation') f.invalidate();
  await rejected;
  assert.equal(f.stats().uiRemoves, 1, kind);
  assert.equal(f.stats().unmounts, kind === 'already-invalid' ? 0 : 1, kind);
}
console.log('PASS: first overlay action waits for readiness; initialization/mount failures and invalidation clean up.');
