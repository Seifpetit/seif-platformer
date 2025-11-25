// /editor/grid/index.js
import { R } from '../../core/runtime.js';
import { TILE_COLS, TILE_SIZE } from '../../core/tileset.js';
import { applyToolAt } from '../tools.js';


export class Grid {
  constructor() {
    this.x;this.y;this.w;this.h;this.cols;this.rows;
  }

  setGeometry(x, y, w, h, r, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rows = r;
    this.cols = c;
  }

  update(p) {

    const lvl = R.layout.level;
    const m   = R.input.mouse;

    if (!lvl) return;

    const gx = Math.floor((m.x - this.x) / TILE_SIZE);
    const gy = Math.floor((m.y - this.y) / TILE_SIZE);

    const inside =
          gx >= 0 &&
          gy >= 0 &&
          gx < this.cols &&
          gy < this.rows &&
          m.x >= this.x &&
          m.x < this.x + this.w &&
          m.y >= this.y &&
          m.y < this.y + this.h;

    R.cursor.inGrid = inside;

    if (!inside) {
      R.cursor.tileX = gx;
      R.cursor.tileY = gy;
      R.cursor.x = this.x + gx * TILE_SIZE;
      R.cursor.y = this.y + gy * TILE_SIZE;
      return;

    } else {
      R.cursor.x = m.x; // hide cursor offscreen
      R.cursor.y = m.y;
    }

    R.cursor.tileX = gx;
    R.cursor.tileY = gy;
    R.cursor.x = this.x + gx * TILE_SIZE;
    R.cursor.y = this.y + gy * TILE_SIZE;

    if (m.pressed) applyToolAt(gx, gy);

  }


  render(g) {
    const lvl   = R.layout.level;
    const atlas = R.atlas;

    if (!lvl || !atlas) return;

    g.push();

    g.noStroke();
    //g.fill(15); //background
    g.rect(this.x, this.y, this.w, this.h);

    // draw tiles
    for (let gy = 0; gy < this.rows; gy++) {
      for (let gx = 0; gx < this.cols; gx++) {

        // convert panel coords to level coords
        if (gx >= lvl.width || gy >= lvl.height) continue;

        const id = lvl.layers.ground[gy * lvl.width + gx];
        if (!id) continue;

        const z = id - 1;
        const sx = (z % TILE_COLS) * TILE_SIZE;
        const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;

        const dx = this.x + gx * TILE_SIZE;
        const dy = this.y + gy * TILE_SIZE;

        g.image(atlas, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
      }
    }


    // grid lines
    this.drawGridLines(g);


    this.drawCustomCursor(g);

    g.pop();
  }

  drawHighlight(g) {

    const lvl = R.layout.level;


    if (!lvl || !this) return;
    g.push(); g.noStroke(); g.fill(255, 0, 0, 70); // translucent red overlay

    for (let y = 0; y < lvl.height; y++) {
      for (let x = 0; x < lvl.width; x++) {
        if (lvl.layers.collision[y * lvl.width + x]) {
          g.rect(this.x + x * TILE_SIZE, this.y + y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
    g.pop();

  }

  drawGridLines(g) {
    g.push(); g.stroke(60); g.noFill();

        // vertical lines
    for (let x = 0; x <= this.cols; x++) {
      const lx = this.x + x * TILE_SIZE;
      g.line(lx, this.y, lx, this.y + this.h);
    }

    // horizontal lines
    for (let y = 0; y <= this.rows; y++) {
      const ly = this.y + y * TILE_SIZE;
      g.line(this.x, ly, this.x + this.w, ly);
    }
    g.pop();

  }


  drawCustomCursor(g) {

    const cursor = R.cursor;  
    const assets = R.layout.assets;

    if (!cursor.inGrid) return;

    const id = R.layout.selectedId;

    if (id && cursor.inGrid) {
      const z = id - 1;
      const sx = (z % TILE_COLS) * TILE_SIZE;
      const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;

      g.image(
        R.atlas, cursor.x, cursor.y, TILE_SIZE, TILE_SIZE,
        sx, sy, TILE_SIZE, TILE_SIZE
      );
      g.push();
      g.noFill();
      g.stroke(0, 255, 255, 180); g.strokeWeight(2);
      g.rect(cursor.x, cursor.y, TILE_SIZE, TILE_SIZE);
      g.pop();
      
    }
    else if( cursor.inGrid ){
      g.push();
      g.noFill();
      g.stroke(0, 255, 255, 180); g.strokeWeight(2);
      g.rect(cursor.x, cursor.y, TILE_SIZE, TILE_SIZE);
      g.pop();
    }
    else {
      if( assets.cursor_j ){ 
        g.image(
          assets.cursor_j, cursor.x, cursor.y, TILE_SIZE, TILE_SIZE
        );
      }
    }
      

  }

}

