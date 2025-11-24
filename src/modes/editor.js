// ─────────────────────────────────────────────────────────────────────────────
// [BUILDER] Editor mode — grid on left, raw tilesheet (1:1) on right
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { exportLevel, importLevel } from '../core/import-export.js';
import { updateGrid, renderGrid } from '../editor/viewport.js';
import { updatePalette, renderPalette } from '../editor/rightPanel.js'; 
import { updateBottomDock, renderBottomDock } from '../editor/bottomDock/bottomDock.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Builder frame
// Order: world → grid → PALETTE (last, on top) → HUD
// ─────────────────────────────────────────────────────────────────────────────

export function updateBuilder(p) {

  handleBuilderShortcuts(p);
  
  updateGrid(p);
  updatePalette(p);
  updateBottomDock();

}

export function renderBuilder(p, { gWorld, gOverlay, gHUD }) {

  gWorld.clear();
  gOverlay.clear();
  gHUD.clear();

  renderGrid(gWorld);
  renderPalette(gOverlay);
  renderBottomDock(p);
}

export function handleBuilderShortcuts(p) {

  const keys = R.input.keyboard;
  const ctrl = keys["control"] || keys["meta"];

  if( p.keyPressed) {

    if (keys["s"] ) {exportLevel(); keys["s"]=false;}
    if (keys["o"] ) {importLevel(); keys["o"]=false;}

  }
  

}