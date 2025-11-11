// /src/editor/palette.js
// ─────────────────────────────────────────────────────────────────────────────
// [PALETTE] draw the RAW tilesheet 1:1 on the right, centered vertically
// returns { panelX, oy, panelW, panelH } for input hit-testing
// ─────────────────────────────────────────────────────────────────────────────
import { TILE_SIZE, TILE_COLS } from '../core/tileset.js';
import { R } from '../core/runtime.js';

export function drawPalette(g, atlas, viewW, viewH, mode, selectedId) {
     if (!atlas?.width) return null;
  const panelW = atlas.width;              // 580
  const panelX = viewW - panelW;           // flush-right
   const oy     = 0; // vertical center
  // backdrop
  g.noStroke();
  g.fill(0, 0, 0, 150);
  g.rect(panelX, 0, panelW, viewH - R.hud.dim.h);
  // IMPORTANT: make sure no old tint makes the image transparent
  g.noTint?.();        // p5.Graphics supports tint; guard with ?.
  // draw raw sheet 1:1
  g.image(atlas, panelX, oy);
  if (mode === 'tile') {
    // selection highlight
    const sid = R.builder.selectedId;
    if (sid) {
        const col = (sid - 1) % TILE_COLS;
        const row = Math.floor((sid - 1) / TILE_COLS);
        const hx  = panelX + col * TILE_SIZE;
        const hy  = oy     + row * TILE_SIZE;
        g.noFill(); g.stroke(255);
        g.rect(hx, hy, TILE_SIZE, TILE_SIZE);
    }
    }
  else {
    // collision palette (simple)
    g.fill(255); g.textSize(14); g.textAlign(g.LEFT, g.TOP);
    g.text('Collision: Solid (1)', panelX + 10, oy + 10);
  }
  return { panelX, oy, panelW, panelH: atlas.height };
}

export function hitTestPalette(atlas, geom, mode, x, y) {
  if (!geom) return { type: 'none' };
  const { panelX, oy, panelW, panelH } = geom;
  const inside = (x >= panelX && x < panelX + panelW && y >= oy && y < oy + panelH);
  if (!inside) return { type: 'none' };

  if (mode === 'tile') {
    const cx = Math.floor((x - panelX) / TILE_SIZE);
    const cy = Math.floor((y - oy) / TILE_SIZE);
    if (cx < 0 || cx >= TILE_COLS || cy < 0 || (cy * TILE_SIZE) >= (atlas?.height || 0))
      return { type: 'none' };
    const id = cy * TILE_COLS + cx + 1;
    return { type: 'tile', id };
  }
  // collision palette: single “solid” type id = 1
  return { type: 'collision', id: 1 };
}
