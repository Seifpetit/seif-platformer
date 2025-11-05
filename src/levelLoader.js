
// src/levelLoader.js
import { fromId, TILE_SIZE, drawTileId } from './tileset.js';



export async function loadLevel(url) {
  const res = await fetch(url);
  const data = await res.json();

  // dense 2D arrays by layer (width*height), prefilled with 0
  const makeLayer = () => new Array(data.width * data.height).fill(0);
  const layers = {
    ground: makeLayer(),
    detail: makeLayer(),
    collision: makeLayer(),
    decoration: makeLayer()
  };

  // place sparse tiles
  for (const t of data.tiles) {
    const arr = layers[t.layer];
    if (!arr) continue;
    arr[t.y * data.width + t.x] = t.id;
  }

  return { ...data, layers };
}

// simple draw (p5.js): atlas = loaded tile_sheet image
export function drawLayer(p, atlas, layerArr, width, height, cameraX = 0, cameraY = 0) {
  // basic culling window (optional)
  const tileW = TILE_SIZE, tileH = TILE_SIZE;
  const startX = Math.max(0, Math.floor(cameraX / tileW));
  const startY = Math.max(0, Math.floor(cameraY / tileH));
  const endX   = Math.min(width,  Math.ceil((cameraX + p.width)  / tileW));
  const endY   = Math.min(height, Math.ceil((cameraY + p.height) / tileH));

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const id = layerArr[y * width + x];
      if (!id) continue;
      const { col, row } = fromId(id);
      const sx = col * tileW;
      const sy = row * tileH;
      const dx = x * tileW - cameraX;
      const dy = y * tileH - cameraY;
      p.image(atlas, dx, dy, tileW, tileH, sx, sy, tileW, tileH);
    }
  }
}
