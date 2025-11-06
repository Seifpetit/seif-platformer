// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from './runtime.js';
import { TILE_SIZE, TILE_COLS, id, srcRect } from './tileset.js';
import { drawLayer } from './levelLoader.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Builder frame
// Order: world → grid → PALETTE (last, on top) → HUD
// ─────────────────────────────────────────────────────────────────────────────
export function drawBuilder(p, { gWorld, gOverlay, gHUD }) {
  const lvl = R.builder.level;
  const atlas = R.atlas;
  if (!lvl) return;

  // 1) world tiles (if you have any pre-placed)
  drawLayer(gWorld, atlas, lvl.layers.ground, lvl.width, lvl.height, 0, 0);

  // 2) grid
  gOverlay.stroke(60); gOverlay.noFill();
  for (let x = 0; x <= lvl.width; x++) {
    gOverlay.line(x * TILE_SIZE, 0, x * TILE_SIZE, lvl.height * TILE_SIZE);
  }
  for (let y = 0; y <= lvl.height; y++) {
    gOverlay.line(0, y * TILE_SIZE, lvl.width * TILE_SIZE, y * TILE_SIZE);
  }

  // 3) raw palette — draw on the MAIN canvas LAST so it sits on top visually
  //    (we return its geometry so clicks can be mapped 1:1)
  R.builder._paletteGeom = drawRawPalette(gHUD, atlas, p.width, p.height);

  // 4) HUD (bottom bar)
  const HUD_H = 40;
  gHUD.noStroke(); gHUD.fill(20); gHUD.rect(0, p.height - HUD_H - R.builder.padX, p.width, HUD_H);
  gHUD.fill(255); gHUD.textSize(14); gHUD.textAlign(gHUD.LEFT, gHUD.CENTER);
  gHUD.text(`BUILDER  |  Selected: ${R.builder.selectedId || '—'}`, 12, p.height - HUD_H / 2 - R.builder.padX);
}

// ─────────────────────────────────────────────────────────────────────────────
// [PALETTE] draw the RAW tilesheet 1:1 on the right, centered vertically
// returns { panelX, oy, panelW, panelH } for input hit-testing
// ─────────────────────────────────────────────────────────────────────────────
function drawRawPalette(g, atlas, viewW, viewH) {
     if (!atlas?.width) return null;
  const panelW = atlas.width;              // 580
  const panelX = viewW - panelW;           // flush-right
   const oy     = 0; // vertical center
  // backdrop
  g.noStroke();
  g.fill(0, 0, 0, 150);
  g.rect(panelX, 0, panelW, viewH);
  // IMPORTANT: make sure no old tint makes the image transparent
  g.noTint?.();        // p5.Graphics supports tint; guard with ?.
  // draw raw sheet 1:1
  g.image(atlas, panelX, oy);
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
  return { panelX, oy, panelW, panelH: atlas.height };
}

// ─────────────────────────────────────────────────────────────────────────────
// [INPUT] mouse (pick from palette or paint on grid)
// ─────────────────────────────────────────────────────────────────────────────
export function builderMouse(p) {
  const lvl = R.builder.level;
  const pg  = R.builder._paletteGeom;

  // 1) palette click (right side)
  if (pg &&
      p.mouseX >= pg.panelX && p.mouseX < pg.panelX + pg.panelW &&
      p.mouseY >= pg.oy     && p.mouseY < pg.oy + pg.panelH) {

    const cx = Math.floor((p.mouseX - pg.panelX) / TILE_SIZE);
    const cy = Math.floor((p.mouseY - pg.oy)     / TILE_SIZE);

    // guard against bottom partial row (atlas height may not be multiple of TILE_SIZE)
    if (cx >= 0 && cx < TILE_COLS && cy >= 0 &&
        (cy * TILE_SIZE) < R.atlas.height) {
      R.builder.selectedId = id(cx, cy);
    }
    return; // handled
  }

  // 2) grid paint (left side)
  const gx = Math.floor(p.mouseX / TILE_SIZE);
  const gy = Math.floor(p.mouseY / TILE_SIZE);
  if (gx < 0 || gy < 0 || gx >= lvl.width || gy >= lvl.height) return;

  lvl.layers.ground[gy * lvl.width + gx] = R.builder.selectedId || 0;
}

// (optional) mouse wheel placeholder — currently unused with 1:1 palette
export function builderWheel(p, e) {
  e.preventDefault(); // no page scroll while editing
}

// simple keys to leave builder etc.
export function builderKey(p) {
  const k = p.key.toLowerCase();
  if (k === 'g') { R.mode = 'game'; R.RESET_FRAMES = 2; }
}
