// /editor/grid/index.js
import { R } from '../../core/runtime.js';
import { TILE_COLS, TILE_SIZE } from '../../core/tileset.js';
import { applyToolAt } from '../tools.js';

export class Grid {
  constructor() {
    this.x; this.y; this.w; this.h;
    this.cols; this.rows;
  }

  setGeometry(x, y, w, h, r, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rows = r;
    this.cols = c;
  }

  update() {
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
      R.cursor.x = m.x;
      R.cursor.y = m.y;
    }

    R.cursor.tileX = gx;
    R.cursor.tileY = gy;
    R.cursor.x = this.x + gx * TILE_SIZE;
    R.cursor.y = this.y + gy * TILE_SIZE;

    if (m.pressed) applyToolAt(gx, gy);
  }

  render(g) {
    const lvl = R.layout.level;
    if (!lvl) return;

    g.push();

    g.noStroke();
    g.fill(20, 20, 20, 20);
    g.rect(this.x, this.y, this.w, this.h);

    // draw tiles
    for (let gy = 0; gy < this.rows; gy++) {
      for (let gx = 0; gx < this.cols; gx++) {

        if (gx >= lvl.width || gy >= lvl.height) continue;

        const cell = lvl.layers.ground[gy * lvl.width + gx];
        const id = cell.id;
        const REF = cell.atlasRef;

        if (!id || !REF) continue;

        const z = id - 1;
        const sx = (z % TILE_COLS) * TILE_SIZE;
        const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;

        const dx = this.x + gx * TILE_SIZE;
        const dy = this.y + gy * TILE_SIZE;

        const atlas = R.atlas[REF.toLowerCase()];

        if (!atlas) continue;

        g.image(atlas, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
      }
    }

    // grid lines
    this.drawGridLines(g);

    this.drawCustomCursor(g);

    g.pop();
  }

  drawGridLines(g) {
    g.push();
    g.stroke(60);
    g.noFill();

    for (let x = 0; x <= this.cols; x++) {
      const lx = this.x + x * TILE_SIZE;
      g.line(lx, this.y, lx, this.y + this.h);
    }

    for (let y = 0; y <= this.rows; y++) {
      const ly = this.y + y * TILE_SIZE;
      g.line(this.x, ly, this.x + this.w, ly);
    }

    g.pop();
  }

  getSelectedAssetAtlas() {
    const ref = R.ui.selectedAsset?.atlasRef;
    if (!ref) return null;
    return R.atlas[ref.toLowerCase()];
  }

  drawCustomCursor(g) {
    const cursor = R.cursor;
    const assets = R.layout.assets;

    if (!cursor.inGrid) return;
    
    const id = R.ui.selectedAsset?.id;
    if( cursor.inGrid && !id){
      g.push();
      g.fill("#3bd2c3a8");
      g.stroke(0, 255, 255, 180); g.strokeWeight(2);
      g.rect(cursor.x, cursor.y, TILE_SIZE, TILE_SIZE);
      g.pop();
    }
    if (!id) return;

    const atlas = this.getSelectedAssetAtlas();
    if (!atlas) return;

    const z = id - 1;
    const sx = (z % TILE_COLS) * TILE_SIZE;
    const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;

    if (id && cursor.inGrid) {
      const z = id - 1;
      const sx = (z % TILE_COLS) * TILE_SIZE;
      const sy = Math.floor(z / TILE_COLS) * TILE_SIZE;
      g.image(
        atlas, cursor.x, cursor.y, TILE_SIZE, TILE_SIZE,
        sx, sy, TILE_SIZE, TILE_SIZE
      );
      g.push();
      g.noFill();
      g.stroke(0, 255, 255, 180); g.strokeWeight(2);
      g.rect(cursor.x, cursor.y, TILE_SIZE, TILE_SIZE);
      g.pop();
      
    }

    g.push();
    g.noFill();
    g.stroke(0, 255, 255, 180);
    g.strokeWeight(2);
    g.rect(cursor.x, cursor.y, TILE_SIZE, TILE_SIZE);
    g.pop();
  }
}


