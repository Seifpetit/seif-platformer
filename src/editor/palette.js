// palette.js
import { R } from "../core/runtime.js";
import { TILE_SIZE, TILE_COLS } from "../core/tileset.js";

const SHEET_TILE_SIZE = 16;   // <---- your source tilesheet tile size

function computePaletteScale(atlas, P) {
  const panelH = P.h;
  const nativeH = atlas.height;

  // max possible integer multiple of TILE_SIZE that fits panel
  const maxMultiple = Math.floor(panelH / TILE_SIZE);
  const targetH = maxMultiple * TILE_SIZE;

  // final scale
  return targetH / nativeH;
}


// --------------------------------------------
// UPDATE — handle selection
// --------------------------------------------
export function updatePalette(p) {
  const atlas = R.atlas;
  const P = R.builder.panels.palette;
  const m = R.input.mouse;
  if (!atlas || !P) return;

  const scale = computePaletteScale(atlas, P);

  const drawW = atlas.width  * scale;
  const drawH = atlas.height * scale;

  const dx = P.x;
  const dy = P.y;

  const inside =
    m.x >= dx && m.x < dx + drawW &&
    m.y >= dy && m.y < dy + drawH;

  if (inside && m.pressed && m.button === 'left') {

    const relX = (m.x - dx) / scale;
    const relY = (m.y - dy) / scale;

    const cx = Math.floor(relX / TILE_SIZE);
    const cy = Math.floor(relY / TILE_SIZE);

    const id = cy * TILE_COLS + cx + 1;
    R.builder.selectedId = id;
  }
}


// --------------------------------------------
// RENDER — draw sheet + highlight
// --------------------------------------------
export function renderPalette(g) {
  const atlas = R.atlas;
  const P = R.builder.panels.palette;

  if (!atlas || !P) return;

  g.push();

  g.noStroke();
  g.fill(0,0,0,150);
  g.rect(P.x, P.y, P.w, P.h);

  const scale = computePaletteScale(atlas, P);

  const drawW = atlas.width  * scale;
  const drawH = atlas.height * scale;

  const dx = P.x;
  const dy = P.y;

  g.image(atlas, dx, dy, drawW, drawH);

  // highlight
  const id = R.builder.selectedId;
  if (id) {
    const z = id - 1;
    const col = z % TILE_COLS;
    const row = Math.floor(z / TILE_COLS);

    const hx = dx + col * TILE_SIZE * scale;
    const hy = dy + row * TILE_SIZE * scale;

    g.noFill();
    g.stroke(255,255,0);
    g.strokeWeight(2);
    g.rect(hx, hy, TILE_SIZE * scale, TILE_SIZE * scale);
  }

  g.pop();
}

