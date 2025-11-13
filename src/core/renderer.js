// /src/core/renderer.js
import { TILE_SIZE, TILE_COLS } from './tileset.js';
import { R } from '../core/runtime.js';
// ─────────────────────────────────────────────────────────────────────────────
// [RENDER] drawLayer(p, atlas, layerArr, width, height, cam.y, cam.y)
// - Computes culling window (startX/Y..endX/Y) from camera and canvas size
// - Loops visible tiles only
// - Draw order per layer is controlled by main.js
// ─────────────────────────────────────────────────────────────────────────────
export function drawLayer(g, atlas, arr, w, h, ox = 0, oy = 0) {

  if (!atlas || !arr) return;
  g.push();

    const cam = R.camera;
    if(!cam) return;

    // ────{Camera Culling}────────────────────────────────────────────────────────────
    const startX = Math.floor(cam.x / TILE_SIZE);
    const startY = Math.floor(cam.y / TILE_SIZE);
    const endX   = Math.ceil((cam.x + cam.w)  / TILE_SIZE);
    const endY   = Math.ceil((cam.y + cam.h) / TILE_SIZE);

    for (let y = startY; y < endY; y++) {
      for (let x = startX; x < endX; x++) {

        const id = arr[y * width + x];
        if (!id) continue;

        const { col, row } = fromId(id);

        const sx = col * TILE_SIZE;
        const sy = row * TILE_SIZE;

        const dx = x * TILE_SIZE - cam.x;
        const dy = y * TILE_SIZE - cam.y;

        p.image(atlas, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);

      }
    }

  g.pop();

}

