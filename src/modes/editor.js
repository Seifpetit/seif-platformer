// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { TILE_SIZE } from '../core/tileset.js';
import { drawLayer } from '../core/renderer.js';
import { drawGrid } from '../editor/grid/index.js';
import { drawPalette, hitTestPalette } from '../editor/palette.js';
import * as brushes from '../editor/operations.js';
import { drawHUD } from '../editor/hud.js';

// --- HUD layout constants (local to builder) ---

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
  drawGrid(gOverlay, lvl.width, lvl.height, TILE_SIZE, 60);

  // 3) raw palette — draw on the MAIN canvas LAST so it sits on top visually
  //    (we return its geometry so clicks can be mapped 1:1)
  R.builder._paletteGeom = drawPalette(gHUD, atlas, p.width, p.height);

  // ─────────────────────────────────────────────
  // [HUD/HELP OVERLAY] hotkey & control guide
  // ─────────────────────────────────────────────
  drawHUD(R, gHUD, p);

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
  if (k === '1') R.builder.mode = 'tile';
  if (k === '2') R.builder.mode = 'collision';
  if (k === 'b') R.builder.tool = 'brush';
  if (k === 'e') R.builder.tool = 'eraser';
  if (k === 'i') R.builder.tool = 'picker';
  if (k === 'h') R.hud.showHelp = !R.hud.showHelp;

  if (k === 'g') { R.mode = 'game'; R.RESET_FRAMES = 2; } // link hides in game HUD
}

export function exportLevel() {
  const data = JSON.stringify(R.builder.level, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'level1.json';
  a.click();
  URL.revokeObjectURL(a.href);
  console.log('Level exported:', R.builder.level);
}

export function importLevel() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = e => handleFileInput(e.target.files[0]);
  input.click();
}

export function handleFileInput(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);  // raw JSON
      // optional: validate structure (width, height, layers)
      if (data.width && data.height && data.layers) {
        R.builder.level = data;   // <- this line makes the grid redraw
        console.log('Level imported successfully:', data.name || '(unnamed)');
      } else {
        console.warn('Invalid level format');
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };
  reader.readAsText(file);
}

export function builderMouseHeld(p) {
  const lvl = R.builder.level;
  if (!lvl) return;

  // find grid coords
  const gx = Math.floor(p.mouseX / TILE_SIZE);
  const gy = Math.floor(p.mouseY / TILE_SIZE);
  if (gx < 0 || gy < 0 || gx >= lvl.width || gy >= lvl.height) return;

  const index = gy * lvl.width + gx;

  // left click = paint
  if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
    lvl.layers.ground[index] = R.builder.selectedId || 0;
  }

  // right click = erase
  if (p.mouseIsPressed && p.mouseButton === p.RIGHT) {
    lvl.layers.ground[index] = 0;
  }
}

export function builderMouseDown(p) {
  const geom = R.builder._paletteGeom;
  const hit = hitTestPalette(R.atlas, geom, R.builder.mode, p.mouseX, p.mouseY);
  if (hit.type === 'tile') { R.builder.selectedId = hit.id; return; }
  if (hit.type === 'collision') { R.builder.selectedId = 1; return; }

  const { gx, gy } = brushes.screenToGrid(p.mouseX, p.mouseY);
  brushes.beginStroke(R, { gx, gy, button: p.mouseButton === p.RIGHT ? 2 : 0 });
}

export function builderMouseMove(p) {
  if (!R.builder._painting) return;
  const { gx, gy } = brushes.screenToGrid(p.mouseX, p.mouseY);
  brushes.dragStroke(R, { gx, gy, button: p.mouseButton === p.RIGHT ? 2 : 0 });
}

export function builderMouseUp() {
  brushes.endStroke(R);
}