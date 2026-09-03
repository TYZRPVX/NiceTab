# NiceTab 深色模式图标计划

## 摘要

让 NiceTab 的品牌图标在浅色、深色、自动主题下保持清晰一致：

- 管理页左上角 Logo、所有扩展页面的浏览器标签 favicon、Popup、新标签页支持深色样式。
- Chromium（Chrome / Edge / Vivaldi）工具栏图标严格跟随 NiceTab 的 `light / dark / auto` 设置；自动模式在没有打开 NiceTab 页面时也随系统主题立即更新。
- Firefox 工具栏图标使用原生 `theme_icons` 跟随浏览器工具栏主题；不强制跟随 NiceTab 手动主题。

不新增用户设置、不迁移存储数据；复用现有 `themeType`。

## 资源与页面图标

- 将现有品牌图标定义为单色设计：浅色背景使用深灰描边，深色背景使用近白描边；不得使用 CSS `filter: invert()` 处理 PNG。
- 新增两套透明 PNG，命名中的 `light` / `dark` 表示承载图标的背景主题：
  - `public/icon/{16,32,48,96,128}-light.png`：浅色背景使用的深色图标。
  - `public/icon/{16,32,48,96,128}-dark.png`：深色背景使用的浅色图标。
  - 保留 `public/icon/{16,32,48,96,128}.png` 作为扩展安装页、扩展管理页和商店的默认静态图标，采用浅色版。
- 新增 `favicon-light-32.png` 与 `favicon-dark-32.png`，仅用作 NiceTab 自身扩展页面的标签 favicon；第三方网站 favicon 维持原色，不做反色。
- 在 `wxt.config.ts` 明确配置 action 的默认 PNG；Firefox 使用 16px、32px 的配对 `theme_icons`。WXT 支持从 `public/icon` 自动识别这些深浅 PNG 对：<https://wxt.dev/guide/essentials/config/manifest.html>。
- 移除管理页中固定的 `48.png?v=...` 引用。所有可见扩展 HTML 页面保留一个带固定 ID 的 favicon `<link>`，由主题同步逻辑切换为对应的 `favicon-*-32.png`；静态隐私页用 `prefers-color-scheme` 的两个 `<link media>` 作为系统主题回退。

## 运行时主题同步

- 新增无框架的 `BrandMark` React SVG 组件，所有路径使用 `currentColor`：
  - 替换首页顶栏目前通过 CSS `background-image` 加载的固定深灰 `logo.svg`。
  - 组件颜色只来自现有主题 token / CSS 变量，浅色为深灰、深色为近白，并提供可访问名称。
  - 审查自定义 SVG；已有 `currentColor` 图标继续沿用。Ant Design 和 react-icons 图标默认继承文字颜色，不建立第二套资源。
- 在 `Root` 增加仅扩展页面执行的 `applyDocumentFavicon(effectiveTheme)`：
  - 主题初始完成、设置变化和系统主题变化时更新 favicon link。
  - `contentScriptPage` 禁止修改宿主网站 `<head>` 与 favicon。
  - Popup、新标签页、管理页共享该逻辑；命令页没有可见页面 UI，不增加图标切换逻辑。
- 在后台新增 `applyActionIcon(effectiveTheme)`：
  - `light` 映射 `16-light.png` / `32-light.png`，`dark` 映射 `16-dark.png` / `32-dark.png`。
  - 在后台启动、安装、浏览器启动、设置存储变化和收到主题状态变化消息时调用。
  - 保留现有 badge 文本与背景色逻辑，不为每个标签设置单独图标。
  - Chromium 的 `action.setIcon()` 使用多尺寸静态 PNG，符合 Action API 的用途：<https://developer.chrome.com/docs/extensions/reference/api/action>。

## 自动主题与浏览器差异

- Chromium 专用新增极简 offscreen 页面：
  - `wxt.config.ts` 仅在非 Firefox 构建声明 `offscreen` 权限。
  - 该页面不加载 React、Ant Design、样式库或业务数据；只使用 `matchMedia('(prefers-color-scheme: dark)')`。
  - 创建时立即向后台报告当前深浅状态，并监听变化后发送主题消息；后台恢复时主动请求一次当前状态，避免 service worker 暂停后状态过期。
  - 仅使用 `MATCH_MEDIA` 原因创建一个 offscreen document；这是 Chrome 官方为无 DOM 的 service worker 使用 `matchMedia` 提供的机制：<https://developer.chrome.com/docs/extensions/reference/api/offscreen>。
- Firefox 不创建 offscreen 页面，不增加常驻内存；使用 WXT/Firefox 的原生 `theme_icons` 随浏览器工具栏深浅切换。
- 严格 Chromium 自动同步会增加一个极小的常驻 offscreen 文档；实现后必须将其纳入原有“≤80 MB”复测，而非假定没有成本。

## 验收与规范

- 视觉测试矩阵：
  - Chromium：NiceTab 手动浅色、手动深色、自动模式；自动模式在没有任何 NiceTab 页面打开时切换系统深浅主题。
  - Firefox：浅色与深色浏览器工具栏主题下的工具栏图标；扩展页面手动浅色、手动深色、自动模式。
  - 管理页左上角、浏览器标签 favicon、Popup、新标签页、默认 favicon、操作按钮、悬浮/禁用状态均清晰可辨。
- 图标质量要求：
  - 16px / 32px 不依赖浏览器缩放，轮廓不糊、不切边；48px / 96px / 128px 保持同一构图。
  - 内部前景与背景至少保持 3:1 非文字对比；透明 PNG 不带不透明方形底色。
  - 深色模式不得残留固定 `#303846` 品牌描边；第三方 favicon 不得被强行着色。
- 在未来的 `AGENTS.md` 增加规则：
  - 产品品牌图标必须使用主题 token 或有成对深浅资源。
  - 工具栏图标必须按浏览器平台能力实现，不假设 PNG 可自动适配主题。
  - 新增扩展页面时必须接入页面 favicon 同步逻辑；content script 不得修改宿主网站 favicon。
  - 任何为主题监听新增的常驻上下文都必须无 UI 框架依赖，并纳入内存基线测试。
