import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// Build-time only: render each toolbar size directly from vector paths.
const iconDir = new URL('../public/icon/', import.meta.url);
const source = await readFile(new URL('logo.svg', iconDir), 'utf8');
// Enlarge the mark by ~12% and center its visible bounds, preserving its aspect
// ratio. Compensate the source stroke so the rendered line stays equally thin.
const toolbarScale = 1.23;
const toolbarStroke = (1.9 * 1.1) / toolbarScale;
const toolbarTransform = `translate(${14 - 14 * toolbarScale} ${14 - 14.125 * toolbarScale}) scale(${toolbarScale})`;
const toolbarSvg = source
  .replace('translate(-1.4 -1.4) scale(1.1)', toolbarTransform)
  .replaceAll('stroke-width="1.9"', `stroke-width="${toolbarStroke}"`);

for (const size of [16, 20, 24, 32, 40, 48, 64]) {
  for (const [theme, color] of [
    ['light', '#303846'],
    ['dark', '#f3f4f6'],
  ]) {
    const svg = toolbarSvg.replaceAll('#303846', color);
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
      font: { loadSystemFonts: false },
    })
      .render()
      .asPng();
    await writeFile(new URL(`action-${size}-${theme}.png`, iconDir), png);
  }
}
