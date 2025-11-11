// /src/editor/brushes.js
import { TILE_SIZE } from '../core/tileset.js';

function cellIndex(gx, gy, w) { return gy * w + gx; }

export function beginStroke(R, { gx, gy, button = 0 }) {
  R.builder._painting = true;
  applyAt(R, { gx, gy, button });
  R.builder._lastCell = `${gx},${gy}`;
}

export function dragStroke(R, { gx, gy, button = 0 }) {
  if (!R.builder._painting) return;
  const key = `${gx},${gy}`;
  if (key === R.builder._lastCell) return;
  applyAt(R, { gx, gy, button });
  R.builder._lastCell = key;
}

export function endStroke(R) {
  R.builder._painting = false;
  R.builder._lastCell = null;
}

export function pickAt(R, { gx, gy }) {
  const lvl = R.builder.level;
  if (!lvl) return;
  const w = lvl.width, h = lvl.height;
  if (gx < 0 || gy < 0 || gx >= w || gy >= h) return;

  if (R.builder.mode === 'tile') {
    const arr = lvl.layers.ground; // for now, pick from ground
    R.builder.selectedId = arr[cellIndex(gx, gy, w)] || 0;
  } else {
    const arr = lvl.layers.collision;
    const v = arr[cellIndex(gx, gy, w)] || 0;
    R.builder.selectedId = v ? 1 : 1; // keep 1 as “solid”; picking just arms brush
  }
}

// ———————————————————— internals ————————————————————

function applyAt(R, { gx, gy, button }) {
  const lvl = R.builder.level;
  if (!lvl) return;
  const w = lvl.width, h = lvl.height;
  if (gx < 0 || gy < 0 || gx >= w || gy >= h) return;

  const erase = (button === 2) || (R.builder.tool === 'eraser');

  if (R.builder.mode === 'tile') {
    const id = erase ? 0 : (R.builder.selectedId || 0);
    lvl.layers.ground[cellIndex(gx, gy, w)] = id;
  } else if (R.builder.mode === 'collision') {
    const id = erase ? 0 : 1; // 1 = solid
    lvl.layers.collision[cellIndex(gx, gy, w)] = id;
  }
}

// utility for callers
export function screenToGrid(x, y) {
  return { gx: Math.floor(x / TILE_SIZE), gy: Math.floor(y / TILE_SIZE) };
}
