// /src/core/renderer.js
import { TILE_SIZE, TILE_COLS } from './tileset.js';

export function drawLayer(g, atlas, arr, w, h, ox = 0, oy = 0) {
  if (!atlas || !arr) return;
  g.push();
  for (let gy = 0; gy < h; gy++) {
    for (let gx = 0; gx < w; gx++) {
      const id = arr[gy * w + gx] | 0;
      if (!id) continue;
      const z = id - 1;
      const col = z % TILE_COLS;
      const row = (z / TILE_COLS) | 0;
      const sx = col * TILE_SIZE, sy = row * TILE_SIZE;
      const dx = ox + gx * TILE_SIZE, dy = oy + gy * TILE_SIZE;
      g.image(atlas, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
    }
  }
  g.pop();
}

