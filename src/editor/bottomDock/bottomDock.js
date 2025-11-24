// ─────────────────────────────────────────────
// [EDITOR] HUD System
// - Draws bottom info bar and help overlay
// - Manages GitHub link visibility
// - Uses R.panels.hud for layout
// ─────────────────────────────────────────────
import { R } from "../../core/runtime.js";
import { SectionBar } from "./sectionsBar.js";


const dock = {
  sectionBar: new SectionBar(),
}

// ─────────────────────────────────────────────
// [UPDATE] HUD logic (hotkeys, toggles, etc.)
// ─────────────────────────────────────────────
export function updateBottomDock() {

  const p = R.layout.panels.hud;
  dock.sectionBar.update(p);
  
}

// ─────────────────────────────────────────────
// [RENDER] Main HUD render pass
// ─────────────────────────────────────────────

export function renderBottomDock(g) {

  const dockPanel = R.layout.panels.hud;

  const mode = R.ui.bottomDock;

  g.push();
  g.clear();
  g.fill("green");
  g.rect(dockPanel.x, dockPanel.y, dockPanel.w, dockPanel.h)
  dock.sectionBar.render(g); 

  g.fill("orange");
  g.textSize(14);
  g.text("Temp HelpText", dock.sectionBar.x,
          dock.sectionBar.y + dock.sectionBar.h + 25);
  g.text("CONTROL + S: SAVE LEVEL | CONTROL + O: OPEN LEVEL ", 
          dock.sectionBar.x,
          dock.sectionBar.y + dock.sectionBar.h + 50
   );

  ensureGitHubLink(g);
  g.pop();

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
    a.style("color", "#00fffbff");
    a.style("text-decoration", "none");
    a.style("background", "rgba(0, 30, 255, 1)");
    a.style("padding", "0px 10px");
    a.style("border-radius", "4px");

    R.hud.ghlink = a;

  }

  const w = R.hud.ghlink.elt.offsetWidth || 0;
  const x = p.width - w + 10;
  const y = R.layout.panels.hud.y + R.layout.panels.hud.h + R.layout.panels.pad;
  
  const link = R.hud.ghlink;
  link.position(x, y);
  link.show();

}

export function hideGitHubLink() {
  R.hud?.ghlink?.hide?.();
}
