// ─────────────────────────────────────────────
// [EDITOR] HUD System
// - Draws bottom info bar and help overlay
// - Manages GitHub link visibility
// - Uses R.panels.hud for layout
// ─────────────────────────────────────────────
import { TILE_SIZE } from "../core/tileset.js";
import { R } from "../core/runtime.js";

// ─────────────────────────────────────────────
// [UPDATE] HUD logic (hotkeys, toggles, etc.)
// ─────────────────────────────────────────────
export function updateHUD(p) {
  const keys = R.input.keyboard.keys;

  // Toggle help overlay (H)
  if (keys["h"]) R.hud.showHelp = !R.hud.showHelp;

  // Toggle grid visibility (V)
  if (keys["v"]) R.builder.showGrid = !R.builder.showGrid;
}

// ─────────────────────────────────────────────
// [RENDER] Main HUD render pass
// ─────────────────────────────────────────────
export function renderHUD(g, p) {

  const P = R.builder.panels.hud;

  if (!P) return;

  g.push();
  g.clear();

  if (R.hud.showHelp) drawHelpOverlay(g);  drawBottomBar(g);  

  g.pop();

  ensureGitHubLink(p);
  
}

// ─────────────────────────────────────────────
// [DRAW] Help Overlay (instructions)
// ─────────────────────────────────────────────
function drawHelpOverlay(g) {

  const lvl = R.builder.level;

  if (!lvl) return;

  const lines = [
    "[Click] Paint    [Right Click] Erase",
    "[Ctrl+Drag] Select / Bulk paint",
    "[Ctrl/Meta+s]  Export    [Ctrl/Meta+o] Import    [G] Playtest",
    "[V] Toggle Grid    [H] Hide Help"
  ];

  const x = R.builder.panels.grid.x;
  const y = lvl.height * TILE_SIZE;
  const w = R.builder.panels.grid.w;
  const h = g.height - R.hud.dim.h - y;
  const textSize = 18;

  g.noStroke();
  g.fill(0, 0, 0, 160);
  g.rect(x, y, w, h);

  g.textAlign(g.LEFT, g.TOP);
  g.textSize(textSize);
  g.fill(230);

  let startY = y + R.builder.pad;
  for (let line of lines) {
    g.text(line, x + R.builder.pad, startY);
    startY += textSize + 4;
  }
}

// ─────────────────────────────────────────────
// [DRAW] Bottom Status Bar
// ─────────────────────────────────────────────
function drawBottomBar(g) {

  const P = R.builder.panels.hud;
  if (!P) return;

  g.stroke("orange");
  g.strokeWeight(2);
  g.fill(20);
  g.rect(P.x, P.y, P.w, P.h);

  g.noStroke();
  g.fill(255);
  g.textSize(14);
  g.textAlign(g.LEFT, g.CENTER);

  const mode = `Mode: ${R.builder.mode?.toUpperCase() || "EDIT"}`;
  const tool = `Tool: ${R.builder.tool?.toUpperCase() || "PAINT"}`;
  const sel = `Selected: ${R.builder.selectedId || "—"}`;
  const phys = `Physics: ${R.physics?.enabled ? "ON" : "OFF"}`;

  g.text(
    `BUILDER | ${mode} • ${tool} • ${sel} • ${phys}`,
    R.builder.pad,
    P.y + P.h / 2 - 2
  );

}

// ─────────────────────────────────────────────
// [LINK] GitHub Source link (DOM overlay)
// ─────────────────────────────────────────────
function ensureGitHubLink(p) {

  
  if (R.mode !== "builder" || !R.hud) return hideGitHubLink();


  if (!R.hud.ghlink) {
    const a = p.createA(
      "https://github.com/Seifpetit/seif-platformer",
      "View Source: GitHub ↗",
      "_blank"
    );

    a.style("font-size", "14px");
    a.style("font-family", "monospace");
    a.style("color", "#00baff");
    a.style("text-decoration", "none");
    a.style("background", "rgba(0,0,0,0.35)");
    a.style("padding", "4px 8px");
    a.style("border-radius", "6px");

    R.hud.ghlink = a;

  }

  const w = R.hud.ghlink.elt.offsetWidth || 0;
  const x = p.width - w - R.builder.pad;
  const y = R.builder.panels.hud.y + (R.builder.panels.hud.h - R.builder.pad) / 2;
  
  const link = R.hud.ghlink;
  link.position(x, y);
  link.show();

}

export function hideGitHubLink() {
  R.hud?.ghlink?.hide?.();
}
