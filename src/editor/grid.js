// /editor/grid/index.js
import { R } from '../core/runtime.js';
import { TILE_COLS, TILE_SIZE } from '../core/tileset.js';
import { applyToolAt } from './tools.js';


export function updateGrid(p) {

  const lvl   = R.builder.level;
  const G = R.builder.panels.grid;
  const m = R.input.mouse;

  if (!lvl || !G) return;

  const gx = Math.floor((m.x - G.x) / TILE_SIZE);
  const gy = Math.floor((m.y - G.y) / TILE_SIZE);
  const inside = gx >= 0 && gy >= 0 && gx < lvl.width && gy < lvl.height;
  
  if( inside && m.pressed )  applyToolAt(gx, gy);

}

export function renderGrid(g) {

  const lvl   = R.builder.level;
  const G = R.builder.panels.grid;
  const atlas = R.atlas;

  if (!lvl || !G || !atlas || !R.atlas || R.atlas.width === 0 || R.atlas.height === 0) return;
  
  g.push();

  //  g.fill(0, 200, 255, 30);
  //  g.rect(G.x, G.y, G.w, G.h);

  for (let y = 0; y < lvl.height; y++) {
    for (let x = 0; x < lvl.width; x++) {

      const id = lvl.layers.ground[y * lvl.width + x];
      if (!id) continue; 
        
        const z = id - 1;
        const sx = (z % TILE_COLS) * TILE_SIZE;
        const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;
        g.image(atlas, G.x + x * TILE_SIZE, G.y + y * TILE_SIZE, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
    }
  }

  // optional overlays (toggled via R.builder flags)
  if (R.builder.showCollision) {
    drawHighlight(g);
  }

  drawGridLines(g);

  g.pop();
}

export function drawHighlight(g) {

  const lvl = R.builder.level;
  const G = R.builder.panels.grid;

  if (!lvl || !G) return;
  g.push(); g.noStroke(); g.fill(255, 0, 0, 70); // translucent red overlay

  for (let y = 0; y < lvl.height; y++) {
    for (let x = 0; x < lvl.width; x++) {
      if (lvl.layers.collision[y * lvl.width + x]) {
        g.rect(G.x + x * TILE_SIZE, G.y + y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }
  g.pop();

}

export function drawGridLines(g) {

  const lvl = R.builder.level;
  const G = R.builder.panels.grid;

  if (!lvl || !G) return;
  g.push(); g.stroke(60); g.noFill();

  for (let x = 0; x <= lvl.width; x++) {
    g.line(G.x + x * TILE_SIZE, 0, G.x + x * TILE_SIZE, lvl.height * TILE_SIZE);
  }
  for (let y = 0; y <= lvl.height; y++) {
    g.line(0, G.y + y * TILE_SIZE, lvl.width * TILE_SIZE, G.y + y * TILE_SIZE);
  }
  g.pop();

}
