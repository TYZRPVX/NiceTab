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
