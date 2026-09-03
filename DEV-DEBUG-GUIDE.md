# NiceTab 开发调试指南

本项目基于 [WXT](https://wxt.dev/) 框架构建，使用 pnpm 管理依赖。以下是快速调试和编译的方法。

## 1. 安装依赖

```bash
pnpm install
```

## 2. 快速调试（开发模式，带热更新）

```bash
pnpm dev
```

执行后 WXT 会：
- 编译代码到 `.output/chrome-mv3-dev` 目录
- 启动文件监听，代码改动后自动重新编译（大部分改动几秒内生效，HMR 优先，部分改动会自动刷新扩展）
- 常规情况下会自动帮你打开一个独立的 Chrome 实例并加载好插件（首次运行会提示选择/使用一个专用的调试 Profile）

如果不想用它自动打开的浏览器实例，手动加载调试版插件：
1. 打开 Chrome，访问 `chrome://extensions/`
2. 打开右上角「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择目录 `.output/chrome-mv3-dev`

### 调试小技巧

- **改 UI/popup/options 页面代码**：`pnpm dev` 运行中一般会自动热更新，浏览器里对应页面无需手动刷新。
- **改 background（service worker）代码**：有时热更新对 background 生效较慢，如果发现逻辑没更新，去 `chrome://extensions/` 找到该插件，点击 service worker 下的「检查」或直接点插件卡片上的「刷新」按钮重新加载。
- **改 content script**：content script 修改后通常需要刷新目标网页标签才能生效（扩展本身重新加载后，已经打开的旧页面里注入的 content script 不会自动更新）。
- **查看日志**：
  - popup / options 页面：右键页面 → 「检查」打开对应 DevTools。
  - background / service worker：在 `chrome://extensions/` 找到插件卡片，点击「service worker」链接打开专属 DevTools。
  - content script：在目标网页上打开 DevTools，日志会出现在 Console 里（注意 context 是页面自身，不是插件）。
- **Firefox 调试**：`pnpm dev:firefox`，会自动用 web-ext 启动一个 Firefox 实例加载插件。

## 3. 正式编译打包

```bash
# 编译 Chrome 版本，输出到 .output/chrome-mv3
pnpm build

# 编译 Firefox 版本
pnpm build:firefox

# 编译并打包成 zip（用于发布/提交商店），输出到 .output/*.zip
pnpm zip
pnpm zip:firefox
```

编译产物加载方式与 dev 版一致，去 `chrome://extensions/` 加载 `.output/chrome-mv3` 目录即可。

## 4. 打包成 .crx 安装包

`.output/chrome-mv3` 是未打包目录，只能用「加载已解压的扩展程序」安装。要分发给别人（离线安装 / 内部分享），需要打成 `.crx`。

### 4.1 一键脚本（推荐）

```bash
pnpm build        # 先产出 .output/chrome-mv3
pnpm pack:crx     # 打包成 release/nice-tab-<version>.crx
```

脚本 `scripts/pack-crx.mjs` 做的事：
- 调用本机 Chrome 的 `--pack-extension` 能力打包
- 首次运行会生成私钥 `keys/nicetab.pem`，之后每次复用它，**保证扩展 ID 不变**（升级安装必须用同一把私钥）
- 产物统一改名放到 `release/` 目录，带上 `package.json` 里的版本号

常用参数：

```bash
# 指定 Chrome 路径（脚本找不到时）
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" pnpm pack:crx

# 指定源目录 / 输出目录 / 私钥
pnpm pack:crx -- --src=.output/chrome-mv3 --out=release --key=keys/nicetab.pem
```

> ⚠️ `keys/` 和 `*.pem` 已在 `.gitignore` 里，私钥不要提交，也不要泄露；丢了就只能换新 ID 重新分发。

### 4.2 手动打包（Chrome 界面）

1. 打开 `chrome://extensions/`，开启「开发者模式」
2. 点击「打包扩展程序」
3. 「扩展程序根目录」选 `.output/chrome-mv3`
4. 「私有密钥文件」：首次留空（会生成 `.pem`），后续升级必须选上一次生成的 `.pem`
5. 点「打包扩展程序」，会在源目录同级生成 `chrome-mv3.crx`

### 4.3 安装 crx 的注意事项

Chrome 出于安全策略，默认不允许从非商店渠道拖入安装 crx。测试时可以：
- 直接用「加载已解压的扩展程序」加载 `.output/chrome-mv3`（最省事）
- 或者把 crx 解压后再按未打包方式加载
- 企业环境可通过策略 `ExtensionInstallAllowlist` / `ExtensionSettings` 放行

### 4.4 crx 用 Git LFS 管理

crx 是二进制大文件，直接进 git 会让仓库越来越臃肿，所以**用 Git LFS 托管**——文件照样提交到 GitHub，只是内容存在 LFS 里，git 仓库里只留一个指针。

规则已经配好：
- `.gitattributes`：`*.crx`、`*.xpi` 走 `filter=lfs`
- `.gitignore`：`release/` 目录下只放行 `*.crx`，其他中间产物忽略

首次使用需要在本机初始化一次 LFS：

```bash
brew install git-lfs   # 或参考 https://git-lfs.com
git lfs install
```

之后正常提交即可：

```bash
pnpm build && pnpm pack:crx
git add release/nice-tab-3.0.2.crx
git commit -m "chore: release crx 3.0.2"
git push
```

校验是否真的走了 LFS：

```bash
git lfs track          # 查看当前生效的 track 规则
git lfs ls-files       # 列出被 LFS 管理的文件
```

克隆仓库的人需要装了 git-lfs 才能拿到真实的 crx；否则 checkout 出来的是指针文本文件，执行 `git lfs pull` 补齐即可。

> 注意：如果之前已经有 crx 用普通方式提交过，加了 `.gitattributes` 也只对新提交生效，历史文件需要 `git lfs migrate import --include="*.crx"` 重写历史（会改 commit hash，谨慎操作）。

## 5. 类型检查 / lint

```bash
pnpm compile   # 只做 TS 类型检查，不产生文件
pnpm lint      # eslint 检查 + 自动修复 entrypoints 目录
```

## 6. 目录结构速览（entrypoints）

- `background/` — 后台 service worker 逻辑
- `content/` — content script（注入到网页）
- `popup/` — 点击插件图标弹出的弹窗页面
- `options/` — 设置页
- `nice-newtab/` — 新标签页替换相关页面
- `common/` — 公共组件/逻辑
- `types/` — 类型定义

改代码时先确认改的是哪个 entrypoint，对应上面调试方式去验证。

## 7. 常见问题

- **改了 manifest 相关配置（`wxt.config.ts`）不生效**：需要重启 `pnpm dev`，manifest 级别的改动不支持热更新。
- **权限相关改动**：修改 `permissions`/`host_permissions` 后，Chrome 会要求重新加载/重新授权扩展，去 `chrome://extensions/` 手动移除旧的再重新加载最稳。
- **多个 Chrome/Profile 冲突**：如果本机已经装了正式版 NiceTab，建议用独立的调试 Profile（`pnpm dev` 默认会用独立 profile），避免正式数据被覆盖。
