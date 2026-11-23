# Theme and icon rules

- Keep the NiceTab mark monochrome. Use the dark mark on light surfaces.
- Use the light mark on dark surfaces. Do not CSS-invert raster icons.
- Use `BrandMark` for extension UI branding. Its paths must use `currentColor`.
- Keep website favicons unchanged. Only NiceTab extension pages use themed favicons.
- Keep the `nicetab-theme-favicon` link in React extension pages.
- Keep privacy as static HTML with light and dark media-query favicon links.
- Chromium action icons follow the effective app theme. Firefox uses manifest `theme_icons`.
- Do not add theme handling to content scripts or remote pages.

# Memory rules

- Keep the idle NiceTab home page below the 80 MB target.
- Do not preload React or UI libraries in every content script.
- Mount hidden panels only when opened. Unmount them after closing.
- Keep `tagList` as the only full persisted tab model in page state.
- Tree and drag nodes may store IDs and scalar metadata only.
- Bound every cache. Define its limit and expiry.
- Long lists must keep DOM near the visible rows only.
- New always-on code must document its memory cost.

# Build rules

- After finishing code changes, run `pnpm build && pnpm pack:crx`.
- Do not run `pnpm dev`.
- Do not change the version unless explicitly asked.

# Settings and event rules

- Initialization, reads, and storage watchers must not write back to observed storage.
- Separate applying UI state from persistence. Each user change has one save entry point.
- Normalize browser locales and external settings through the shared language normalizer.
- Skip persistence when the normalized value equals the stored value.
- Test new listener chains for feedback loops, including unsupported locales and multiple pages.

# Content script document safety

- Only load React page overlays in supported `text/html` documents. Skip XML, SVG,
  XHTML and other non-HTML documents before importing any UI dependency.
- Keep the automatic content script free of React/ReactDOM and UI libraries.
  WXT IIFE builds can eagerly evaluate inlined dynamic imports; use the separate
  `content-ui` ES module and verify the production bundles after loader changes.
- Catch overlay import/mount failures, clear failed in-flight state, and prevent
  mounting after content-script invalidation. Never patch the host document APIs.
- Regression-check non-HTML documents and idle HTML pages for zero UI imports,
  plus on-demand loading, failure handling and invalidation during loading.

- Await overlay component readiness after asynchronous settings initialization before
  delivering its first action; clean up partially mounted UI on failure.
