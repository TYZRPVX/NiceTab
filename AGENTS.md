# Theme and icon rules

- Keep the NiceTab mark monochrome. Use the dark mark on light surfaces.
- Use the light mark on dark surfaces. Do not CSS-invert raster icons.
- Use `BrandMark` for extension UI branding. Its paths must use `currentColor`.
- Keep website favicons unchanged. Only NiceTab extension pages use themed favicons.
- Keep the `nicetab-theme-favicon` link in React extension pages.
- Keep privacy as static HTML with light and dark media-query favicon links.
- Chromium action icons follow the effective app theme. Firefox uses manifest `theme_icons`.
- Do not add theme handling to content scripts or remote pages.
