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

  
  if (tool === "paint") { lvl.layers.ground[gy * lvl.width + gx] = R.layout.selectedId; }
  if (tool === "erase") { lvl.layers.ground[gy * lvl.width + gx] = 0; }

}

