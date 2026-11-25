import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('entrypoints/common/commandTransport.ts', 'utf8').replace(/^import .*\n/gm, '');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
});
function event() {
  const listeners = new Set();
  return { addListener: fn => listeners.add(fn), removeListener: fn => listeners.delete(fn),
    emit: value => [...listeners].forEach(fn => fn(value)), count: () => listeners.size };
}
function fixture(execute, sender = { tab: { id: 7, windowId: 2 } }) {
  const onConnect = event();
  let client;
  const runtime = { onConnect, connect: ({ name }) => {
    client = { name, onMessage: event(), onDisconnect: event() };
    const server = { name, sender, onMessage: event(), onDisconnect: event() };
    let disconnected = false;
    const disconnect = () => {
      if (disconnected) return;
      disconnected = true;
      client.onDisconnect.emit(); server.onDisconnect.emit();
    };
    client.disconnect = server.disconnect = disconnect;
    client.postMessage = message => server.onMessage.emit(message);
    server.postMessage = message => {
      if (disconnected) throw Error('Disconnected');
      client.onMessage.emit(message);
    };
    onConnect.emit(server);
    return client;
  }, sendMessage: () => { throw Error('Must not use broadcast request/reply'); } };
  const context = { exports: {}, browser: { runtime }, console: { error() {} } };
  vm.runInNewContext(outputText, context);
  context.exports.registerCommandHandler(execute);
  return { run: context.exports.runSendAllTabsCommand, client: () => client };
}
let resolve;
let executions = 0;
const gate = new Promise(r => { resolve = r; });
const f = fixture(async (id, windowId) => {
  executions++;
  assert.equal(id, 7); assert.equal(windowId, 2);
  await gate;
});
let done = false;
const pending = f.run().then(() => { done = true; });
await Promise.resolve();
assert.equal(done, false, 'Only the actual background completion may acknowledge success');
f.client().postMessage({ action: 'sendAllTabs' });
assert.equal(executions, 1, 'Duplicate port messages must not re-run saving');
resolve(); await pending;
assert.equal(f.client().onMessage.count(), 0);
assert.equal(f.client().onDisconnect.count(), 0);
await assert.rejects(fixture(async () => { throw Error('Pin failed'); }).run(), /Pin failed/);
await assert.rejects(fixture(async () => { throw Error('Must not run'); }, {}).run(), /browser tab/);
const disconnected = fixture(() => new Promise(() => {}));
const result = disconnected.run();
disconnected.client().disconnect();
await assert.rejects(result, /connection closed/);
console.log('PASS: dedicated command responses, single execution, failure and disconnect handling.');
