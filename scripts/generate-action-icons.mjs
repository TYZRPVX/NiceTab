import { readFile, writeFile } from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';

// Build-time only: render each toolbar size directly from vector paths.
const iconDir = new URL('../public/icon/', import.meta.url);
const source = await readFile(new URL('logo.svg', iconDir), 'utf8');
// Keep the toolbar mark centered on the same canvas.
const toolbarSvg = source.replace(
  'translate(-1.4 -1.4) scale(1.1)',
  'translate(-3.5329 -3.5329) scale(1.25235)',
);

for (const size of [16, 32]) {
  for (const [suffix, color] of [['', '#303846'], ['-light', '#303846'], ['-dark', '#f3f4f6']]) {
    const svg = toolbarSvg.replaceAll('#303846', color);
    const png = new Resvg(svg, {
      fitTo: { mode: 'width', value: size },
    }).render().asPng();
    await writeFile(new URL(`${size}${suffix}.png`, iconDir), png);
  }
}
