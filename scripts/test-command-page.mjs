import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('entrypoints/command/main.ts', 'utf8').replace(/^import .*\n/gm, '');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
});
const settle = () => new Promise(resolve => setImmediate(resolve));
async function fixture({ ok = true, closeResults = [true] } = {}) {
  let saves = 0, closes = 0, children = [];
  vm.runInNewContext(outputText, {
    URL, window: { location: { href: 'chrome-extension://test/command.html?action=sendAllTabs' } },
    navigator: { language: 'zh-CN' },
    document: { body: { replaceChildren: (...items) => { children = items; } },
      createElement: tag => ({ tag, textContent: '', addEventListener(_event, handler) { this.click = handler; } }),
    },
    runSendAllTabsCommand: async () => { saves++; if (!ok) throw new Error('Command failed'); },
    browser: { runtime: {},
      tabs: { getCurrent: async () => ({ id: 42 }) } },
    closeCommandTab: async id => { assert.equal(id, 42); return closeResults[closes++] ?? true; },
  });
  await settle();
  return { stats: () => ({ saves, closes, children }), retry: () => children.find(item => item.tag === 'button').click() };
}
const success = await fixture();
assert.equal(success.stats().closes, 1, 'Success must self-close even if background did not');
const retryClose = await fixture({ closeResults: [false, true] });
assert.match(retryClose.stats().children[0].textContent, /标签已保存/);
retryClose.retry(); await settle();
assert.equal(retryClose.stats().closes, 2);
assert.equal(retryClose.stats().saves, 1, 'Close-only retries must not save again');
const failure = await fixture({ ok: false });
assert.equal(failure.stats().closes, 0, 'Do not hide a failed command');
console.log('PASS: command completion self-closes; close failures retry without duplicate saves.');
