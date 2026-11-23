// Run after building: node --experimental-vm-modules scripts/test-content-document-safety.mjs [output-dir]
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const out = process.argv[2] || '.output/chrome-mv3';
const manifest = JSON.parse(fs.readFileSync(path.join(out, 'manifest.json'), 'utf8'));
const files = manifest.content_scripts.flatMap(script => script.js || []);
const code = files.map(file => fs.readFileSync(path.join(out, file), 'utf8')).join('\n');
assert.ok(Buffer.byteLength(code) < 50000, 'Automatic script unexpectedly includes UI dependencies');
assert.doesNotMatch(code, /AnimationEvent|react\.production|react-dom|__SECRET_INTERNALS/);
const uiCode = fs.readFileSync(path.join(out, 'content-ui.js'), 'utf8');
assert.match(uiCode, /AnimationEvent/, 'React must live in the separate UI module');
const uiModule = new vm.SourceTextModule(uiCode);
assert.equal(uiModule.dependencySpecifiers.length, 0, 'UI dependencies must be self-contained');
assert.ok(manifest.web_accessible_resources.some(entry =>
  (typeof entry === 'string' ? [entry] : entry.resources).includes('content-ui.js')));

const settle = () => new Promise(resolve => setImmediate(resolve));
async function fixture(contentType, options = {}) {
  const listeners = new Set();
  let imports = 0, mounts = 0, opens = 0, removes = 0, warns = 0, creates = 0;
  let release;
  const gate = options.defer ? new Promise(resolve => { release = resolve; }) : Promise.resolve();
  const window = new EventTarget();
  window.self = window; window.top = window;
  window.postMessage = data => window.dispatchEvent(new MessageEvent('message', { data }));
  const browser = { runtime: { id: 'test-extension', getURL: file => `chrome-extension://test-extension${file}`,
    onMessage: { addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn) } } };
  const context = vm.createContext({
    window, browser, chrome: browser, AbortController, Event, CustomEvent, URL,
    setInterval, clearInterval, setTimeout, clearTimeout,
    addEventListener: window.addEventListener.bind(window),
    removeEventListener: window.removeEventListener.bind(window),
    console: { ...console, warn: () => warns++ },
    document: { contentType, documentElement: { namespaceURI: 'http://www.w3.org/1999/xhtml' },
      createElement: () => { creates++; return options.noStyle ? {} : { style: {} }; } },
  });
  const script = new vm.Script(code, { importModuleDynamically: async url => {
    imports++;
    assert.equal(url, 'chrome-extension://test-extension/content-ui.js');
    await gate;
    if (options.fail && imports === 1) throw Error('Import failed');
    const module = new vm.SyntheticModule(['default'], function () {
      this.setExport('default', Promise.resolve(async (_ctx, onRemoved) => {
        mounts++;
        if (options.mountFail && mounts === 1) throw Error('Mount failed');
        return { openGlobalSearch: () => opens++, openSendTarget: () => opens++,
          showCallbackMessage: () => opens++, refreshGlobalSearch() {},
          remove: () => { removes++; onRemoved(); } };
      }));
    }, { context });
    await module.link(() => {}); await module.evaluate(); return module;
  }});
  await script.runInContext(context);
  return {
    send: (msgType = 'action:open-global-search-modal') => [...listeners].forEach(fn => fn({ msgType })),
    invalidate: () => window.postMessage({ type: 'test-extension:content:wxt:content-script-started', contentScriptName: 'content', messageId: 'new' }),
    release: () => release?.(),
    stats: () => ({ imports, mounts, opens, removes, warns, creates, listeners: listeners.size }),
  };
}
for (const mime of ['application/xml', 'text/xml', 'image/svg+xml', 'application/xhtml+xml', 'text/plain']) {
  const f = await fixture(mime); f.send(); await settle();
  assert.equal(f.stats().imports, 0); assert.equal(f.stats().mounts, 0);
  assert.equal(f.stats().listeners, 0); assert.equal(f.stats().creates, 0);
}
const unsupported = await fixture('text/html', { noStyle: true });
assert.equal(unsupported.stats().listeners, 0);
const html = await fixture('text/html');
assert.equal(html.stats().imports, 0, 'Idle HTML must not import React');
html.send(); html.send(); await settle(); await settle();
assert.equal(html.stats().imports, 1); assert.equal(html.stats().mounts, 1);
assert.equal(html.stats().opens, 2);
html.invalidate(); await settle();
assert.equal(html.stats().removes, 1); assert.equal(html.stats().listeners, 0);
const failed = await fixture('text/html', { fail: true });
failed.send(); await settle(); await settle();
assert.equal(failed.stats().warns, 1);
failed.send(); await settle(); await settle();
assert.equal(failed.stats().imports, 2); assert.equal(failed.stats().mounts, 1);
const mountFailed = await fixture('text/html', { mountFail: true });
mountFailed.send(); await settle(); await settle();
assert.equal(mountFailed.stats().warns, 1);
mountFailed.send(); await settle(); await settle();
assert.equal(mountFailed.stats().mounts, 2);
assert.equal(mountFailed.stats().opens, 1);
const late = await fixture('text/html', { defer: true });
late.send(); await settle(); late.invalidate(); late.release(); await settle(); await settle();
assert.equal(late.stats().mounts, 0); assert.equal(late.stats().listeners, 0);
console.log(`PASS: ${out}: non-HTML exclusion, idle HTML, shared lazy load, failure retry, invalidation; automatic script ${Buffer.byteLength(code)} bytes.`);
