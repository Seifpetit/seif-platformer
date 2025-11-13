// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { exportLevel, importLevel } from '../core/import-export.js';
import { updateGrid, renderGrid } from '../editor/grid.js';
import { updatePalette, renderPalette } from '../editor/palette.js'; 
import { renderHUD } from '../editor/hud.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Builder frame
// Order: world → grid → PALETTE (last, on top) → HUD
// ─────────────────────────────────────────────────────────────────────────────

export function updateBuilder(p) {

  handleBuilderShortcuts(p);
  
  updateGrid(p);
  updatePalette(p);

}

export function renderBuilder(p, { gWorld, gOverlay, gHUD }) {

  gWorld.clear();
  gOverlay.clear();
  gHUD.clear();

  renderGrid(gWorld);
  renderPalette(gOverlay);
  renderHUD(gHUD, p);
}

export function handleBuilderShortcuts(p) {

  const keys = R.input.keyboard;
  const ctrl = keys["control"] || keys["meta"];

  if( p.keyPressed) {

    console.log("ctrl:",ctrl);
    console.log("s:",keys["s"]);
    console.log("o:",keys["o"]);

    if (keys["s"] ) {console.log("export"); exportLevel(); keys["s"]=false;}
    if (keys["o"] ) {console.log("export"); importLevel(); keys["o"]=false;}

  }
  

}