// /editor/grid/gridLines.js
import { TILE_SIZE } from '../../core/tileset.js';
import { R } from '../../core/runtime.js';

export function drawGridLines(g) {
  const lvl = R.builder.level;
  if (!lvl) return;

  g.stroke(60);
  g.noFill();

  for (let x = 0; x <= lvl.width; x++) {
    g.line(x * TILE_SIZE, 0, x * TILE_SIZE, lvl.height * TILE_SIZE);
  }
  for (let y = 0; y <= lvl.height; y++) {
    g.line(0, y * TILE_SIZE, lvl.width * TILE_SIZE, y * TILE_SIZE);
  }
}
