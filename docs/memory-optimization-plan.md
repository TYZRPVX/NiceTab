# NiceTab 极致内存优化计划

## 摘要

目标是在相同的真实数据、同一浏览器与同一常驻首页场景下，将 NiceTab 的内存从约 115 MB 降至 **80 MB 以下**（≥30%）。不构建 CRX、不要求 WSL 中安装浏览器；代码完成后由本机验证。

## 实施改动

- 将所有网页自动注入的 content script 拆为轻量监听器与动态 UI：
  - 常驻脚本只接收全局搜索消息，不再预加载 React、Ant Design、国际化和 styled-components。
  - 首次触发全局搜索时才动态加载并挂载搜索 UI；关闭后卸载 UI、释放 React 根与事件监听。
  - 保留快捷键和右键菜单触发的全局搜索功能；首次打开会有一次短暂加载延迟。

- 重构首页标签数据的内存结构：
  - 保留 `tagList` 作为唯一完整数据源。
  - 树节点只存标签组的轻量元数据和 ID，不再把完整 `tabList` 放进 `originData`，避免首页状态中同时持有整份存储数据和整份 UI 副本。
  - 通过 ID 从源数据读取标签组详情；不变更现有存储格式、导入导出或同步数据兼容性。

- 把“分段加载直到全部渲染”改为有界渲染：
  - 首页默认只保留可视区域附近的标签组与标签行 DOM，历史标签改为虚拟列表或明确的“继续显示”分页入口。
  - 降低现有列表 overscan / 预渲染范围，切换分类、拖拽和搜索定位仍保持可用。
  - 保留拖拽、批量选择、恢复与编辑；超长列表中未进入视口的行不会维持组件状态。

- 收紧 favicon 与隐藏面板的缓存：
  - 删除无上限的 favicon Promise Map 和整页 `sessionStorage` 图标索引；改为浏览器缓存加有上限的短生命周期缓存。
  - 不再通过 Canvas 为每个站点探测、保存 base64；可见行优先使用扩展 favicon，失败时使用本地图标。
  - 全局搜索、发送目标等非当前操作 UI 改为首次使用时挂载，关闭后销毁。

- 添加根目录 `AGENTS.md`：
  - 规定常驻页面的内存预算与验收方式。
  - 禁止全站预加载重型 UI、无界 Map/数组/会话缓存、重复保存完整持久化模型。
  - 要求长列表保持 O(可视行数) DOM、缓存必须可清理且有上限，新功能必须说明常驻内存影响。

## 行为取舍

- 全局搜索第一次打开会比现在稍慢，之后行为不变。
- 超长标签组不再自动把所有历史标签渲染进 DOM；需要滚动或点击继续加载。
- favicon 不再做跨站网络兜底和永久页面缓存，少数图标会显示默认图标。
- 不删除同步、回收站、新标签页、拖拽、恢复或搜索等核心能力。

## 验证方案

- 仅运行 TypeScript 检查（依赖已安装时执行 `pnpm compile`）；不执行 WXT 打包、不生成 CRX。
- 使用当前真实数据复测：冷启动浏览器，打开常驻首页，等待 60 秒空闲，以 Chrome/Vivaldi 任务管理器记录 NiceTab 对应进程内存；目标 ≤80 MB。
- 验证：全局搜索首次与再次打开、标签组切换、长列表滚动、拖拽/批量操作、favicon 回退、数据变更后的刷新，以及关闭搜索面板后的内存稳定性。

## 假设

- 115 MB 指的是当前常驻 NiceTab 首页在浏览器任务管理器中的内存，且测试时使用同一份真实数据和设置。
- 默认采用“极致轻量”配置：优先内存上限，接受少量首次加载延迟和历史列表按需显示。

---

# 深色模式图标计划

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
