import { R } from "../core/runtime.js";

// ─────────────────────────────────────────────────────────────────────────────
// [TOOL] get active tool based on input state
// ─────────────────────────────────────────────────────────────────────────────
export function getActiveTool() {
  const m = R.input.mouse;
  const k = R.input.keyboard;

  //console.log("mouse:", m, "mouse button:", m.button); //{TEMP CONSOLE LOG}

  if (k["contrl"]) return "select";
  if (m.button === 'right') return "erase";
  return "paint";
}

export function applyToolAt(gx, gy) {

  const tool = getActiveTool();
  const lvl = R.layout.level;

  
  if (tool === "paint") { paint(lvl, gx, gy); }
  if (tool === "erase") { erase(lvl, gx, gy); }

  const BRUSH = R.ui.brushMode;

  if (BRUSH === "PAINT" && !(tool === "erase")) { paint(lvl, gx, gy); }
  if (BRUSH === "ERASE") { erase(lvl, gx, gy); }
  if (BRUSH === "SELECT") { select(lvl, gx, gy); }


}

export function paint(lvl, gx, gy) {
  lvl.layers.ground[gy * lvl.width + gx] =  R.ui.selectedAsset;
  console.log(lvl.layers.ground[gy * lvl.width + gx]);
}

export function erase(lvl, gx, gy) {
  lvl.layers.ground[gy * lvl.width + gx] = 0;
}

export function select(lvl, gx, gy) {
  R.ui.selection.active = true;
  R.ui.selection.startGX = gx;
  R.ui.selection.startGY = gy;
  R.ui.selection.endGX = gx;
  R.ui.selection.endGY = gy;

  if(R.ui.selection.active) {
    R.ui.selection.endGX = gx;
    R.ui.selection.endGY = gy;
  }

  

}