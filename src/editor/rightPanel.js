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

export function getHoveredId(mx, my, dx, dy) {
  const scale = computePaletteScale(R.atlas, R.layout.panels.palette);
  const relX = (mx - dx) / scale;
  const relY = (my - dy) / scale;

  const cx = Math.floor(relX / TILE_SIZE);
  const cy = Math.floor(relY / TILE_SIZE);

  const id = cy * TILE_COLS + cx + 1;

  return id;
}

export function drawToolCursor(g, dx, dy, scale) {

  if (R.cursor.inPalette) {
    const hoverId = getHoveredId(R.input.mouse.x, R.input.mouse.y, dx, dy);
    const z = hoverId - 1;
    const col = z % TILE_COLS;
    const row = Math.floor(z / TILE_COLS);
    const hx = dx + col * TILE_SIZE * scale;
    const hy = dy + row * TILE_SIZE * scale;
    const hex1 = "#00ffff";
    g.push();
        g.noFill();
        g.stroke(hex1); g.strokeWeight(2);
        g.rect(hx, hy, TILE_SIZE * scale, TILE_SIZE * scale);
        g.pop();

   
    
  }
   const selectId = R.layout.selectedId;
  if (selectId) { // highlight after selection
      const hex2 = "#ffff00";
      const z = selectId - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);
      const hx = dx + col * TILE_SIZE * scale;
      const hy = dy + row * TILE_SIZE * scale;
      g.push();
        g.noFill();
        g.stroke(hex2); g.strokeWeight(2);
        g.rect(hx, hy, TILE_SIZE * scale, TILE_SIZE * scale);
        g.pop();
  }


}


// --------------------------------------------
// UPDATE — handle selection
// --------------------------------------------
export function updatePalette(p) {
  const atlas = R.atlas;
  const P = R.layout.panels.palette;
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
  R.cursor.inPalette = inside;

  if (inside && m.pressed && m.button === 'left') {

    const id = getHoveredId(m.x, m.y, dx, dy);
    R.layout.selectedId = id;

  }
}


// --------------------------------------------
// RENDER — draw sheet + highlight
// --------------------------------------------
export function renderPalette(g) {
  const atlas = R.atlas;
  const P = R.layout.panels.palette;

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

  drawToolCursor(g, dx, dy, scale);

  g.pop();
}

