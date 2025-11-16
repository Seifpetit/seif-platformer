// /editor/grid/index.js
import { R } from '../core/runtime.js';
import { TILE_COLS, TILE_SIZE } from '../core/tileset.js';
import { applyToolAt } from './tools.js';


export function updateGrid(p) {
  const lvl = R.builder.level;
  const G   = R.builder.panels.grid;
  const m   = R.input.mouse;

  if (!lvl || !G) return;

  const gx = Math.floor((m.x - G.x) / TILE_SIZE);
  const gy = Math.floor((m.y - G.y) / TILE_SIZE);

  const inside =
        gx >= 0 &&
        gy >= 0 &&
        gx < G.cols &&
        gy < G.rows &&
        m.x >= G.x &&
        m.x < G.x + G.w &&
        m.y >= G.y &&
        m.y < G.y + G.h;


  if (inside && m.pressed) {
    applyToolAt(gx, gy);
  }
}


export function renderGrid(g) {
  const lvl   = R.builder.level;
  const G     = R.builder.panels.grid;
  const atlas = R.atlas;

  if (!lvl || !G || !atlas) return;

  g.push();

  g.noStroke();
  //g.fill(15); //background
  g.rect(G.x, G.y, G.w, G.h);

  // draw tiles
  for (let gy = 0; gy < G.rows; gy++) {
    for (let gx = 0; gx < G.cols; gx++) {

      // convert panel coords to level coords
      if (gx >= lvl.width || gy >= lvl.height) continue;

      const id = lvl.layers.ground[gy * lvl.width + gx];
      if (!id) continue;

      const z = id - 1;
      const sx = (z % TILE_COLS) * TILE_SIZE;
      const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;

      const dx = G.x + gx * TILE_SIZE;
      const dy = G.y + gy * TILE_SIZE;

      g.image(atlas, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
    }
  }


  // grid lines
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

  const G = R.builder.panels.grid;

  if (!G) return;
  g.push(); g.stroke(60); g.noFill();

      // vertical lines
  for (let x = 0; x <= G.cols; x++) {
    const lx = G.x + x * TILE_SIZE;
    g.line(lx, G.y, lx, G.y + G.h);
  }

  // horizontal lines
  for (let y = 0; y <= G.rows; y++) {
    const ly = G.y + y * TILE_SIZE;
    g.line(G.x, ly, G.x + G.w, ly);
  }
  g.pop();

}
