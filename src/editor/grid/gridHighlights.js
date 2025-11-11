// /editor/grid/gridHighlights.js
import { TILE_SIZE } from '../../core/tileset.js';
import { R } from '../../core/runtime.js';

export function drawCollisionOverlay(g) {
  const lvl = R.builder.level;
  if (!lvl) return;

  g.noStroke();
  g.fill(255, 0, 0, 70); // translucent red overlay

  for (let y = 0; y < lvl.height; y++) {
    for (let x = 0; x < lvl.width; x++) {
      if (lvl.layers.collision[y * lvl.width + x]) {
        g.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
}
