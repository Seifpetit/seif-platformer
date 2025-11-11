// /src/editor/hud.js
export function drawHUD(R, gHUD, p) {

  gHUD.stroke("orange");gHUD.strokeWeight(2); gHUD.fill(20); gHUD.rect(0, p.height - R.hud.dim.h - R.builder.padX, p.width, R.hud.dim.h); //rectangle
  gHUD.noStroke();gHUD.fill(255); gHUD.textSize(14); gHUD.textAlign(gHUD.LEFT, gHUD.CENTER);

  const mode = `Mode: ${R.builder.mode.toUpperCase()}`;
  const tool = `Tool: ${R.builder.tool.toUpperCase()}`;
  const sel  = `Selected: ${R.builder.selectedId || '—'}`;
  const phys = `Physics: ${R.physics?.enabled ? 'ON' : 'OFF'}`;

  gHUD.text(`BUILDER  |  ${mode}  •  ${tool}  •  ${sel}  •  ${phys}`, R.builder.padX, p.height - R.hud.dim.h / 2 - R.builder.padX);

  ensureGitHubLink(R, p);
}

export function drawHelpOverlay(R, gHUD, p) {
  if (R.builder.showHelp) {
  
          const lines = [
              '[Click] Paint    [Right Click] Erase',
              '[E] Export    [I] Import    [G] Playtest',
              '[V] Toggle Grid    [H] Hide Help'
          ];
   
          const x_helpOverlay = 0;
          const y_helpoverlay = lvl.height * TILE_SIZE;
          const h_helpOverlay = p.height - R.hud.dim.h - y_helpoverlay;
          const w_helpOverlay = lvl.width*TILE_SIZE;
  
          const textsize = 24;
  
          gHUD.noStroke();
          gHUD.fill(0, 0, 0, 150);
          gHUD.rect(x_helpOverlay, y_helpoverlay, w_helpOverlay, h_helpOverlay);
          gHUD.textAlign(gHUD.LEFT, gHUD.TOP);
          gHUD.textSize(textsize);
          gHUD.fill(200, 220);
  
          let startY = y_helpoverlay + R.builder.padX;
          for (let line of lines) {
              gHUD.text(line, x_helpOverlay + R.builder.padX, startY);
              startY += textsize;
          }
  
  
      }
}

export function ensureGitHubLink(R, p) {
  // show only in builder
  if (R.mode !== 'builder') return hideGitHubLink(R);

  if (!R.hud.ghlink) {
    R.hud.ghlink = p.createA("https://github.com/Seifpetit/seif-platformer", "View Source: GitHub ↗", "_blank");
    const el = R.hud.ghlink;
    el.style("font-size", "14px");
    el.style("font-family", "monospace");
    el.style("color", "#00baff");
    el.style("text-decoration", "none");
    el.style("background", "rgba(0,0,0,0.35)");
    el.style("padding", "4px 8px");
    el.style("border-radius", "6px");
  }
  const w = R.hud.ghlink.elt.offsetWidth || 0;
  const x = p.width - w - R.builder.padX;
  const y = p.height - R.hud.dim.h - R.builder.padX + (R.hud.dim.h - 18) / 2;
  R.hud.ghlink.position(x, y);
  R.hud.ghlink.show();
}

export function hideGitHubLink(R) {
  R.hud?.ghlink?.hide?.();
}
