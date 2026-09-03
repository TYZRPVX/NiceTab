// 把已编译好的扩展目录打包成 .crx 文件
// 用法：pnpm build && pnpm pack:crx [-- --browser=chrome]
// 依赖本机安装的 Chromium 浏览器（走 --pack-extension 能力）

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const args = process.argv.slice(2);
const getArg = (name, fallback) => {
  const hit = args.find((item) => item.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};

const srcDir = path.resolve(root, getArg('src', '.output/chrome-mv3'));
const outDir = path.resolve(root, getArg('out', 'release'));
const keyFile = path.resolve(root, getArg('key', 'keys/nicetab.pem'));

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Vivaldi.app/Contents/MacOS/Vivaldi',
  '/Applications/Vivaldi Snapshot.app/Contents/MacOS/Vivaldi Snapshot',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chromeBin = chromeCandidates.find((bin) => fs.existsSync(bin));

if (!fs.existsSync(srcDir)) {
  console.error(`[pack-crx] 找不到编译产物目录：${srcDir}\n请先执行 pnpm build`);
  process.exit(1);
}
if (!chromeBin) {
  console.error(
    '[pack-crx] 没找到 Chromium 浏览器，请设置 CHROME_PATH 指向 Chrome、Vivaldi 或 Chromium'
  );
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.dirname(keyFile), { recursive: true });

const packArgs = [`--pack-extension=${srcDir}`, '--no-message-box'];
if (fs.existsSync(keyFile)) {
  // 复用已有私钥，保证扩展 ID 不变
  packArgs.push(`--pack-extension-key=${keyFile}`);
}

execFileSync(chromeBin, packArgs, { stdio: 'inherit' });

// Chrome 会把 crx/pem 生成在源目录同级
const generatedCrx = `${srcDir}.crx`;
const generatedKey = `${srcDir}.pem`;

if (!fs.existsSync(generatedCrx)) {
  console.error('[pack-crx] 打包失败，没有生成 crx 文件');
  process.exit(1);
}

const { version } = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf8'));
const targetCrx = path.join(outDir, `nice-tab-${version}.crx`);
fs.renameSync(generatedCrx, targetCrx);

if (fs.existsSync(generatedKey)) {
  if (fs.existsSync(keyFile)) {
    fs.rmSync(generatedKey);
  } else {
    // 首次打包生成的私钥，保存下来供后续复用（不要提交到仓库）
    fs.renameSync(generatedKey, keyFile);
    console.log(`[pack-crx] 已生成私钥：${path.relative(root, keyFile)}（请妥善保管，勿提交）`);
  }
}

console.log(`[pack-crx] 打包完成：${path.relative(root, targetCrx)}`);
