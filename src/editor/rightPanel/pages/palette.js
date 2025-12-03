
import { R } from "../../../core/runtime.js";
import { TILE_SIZE, TILE_COLS } from "../../../core/tileset.js";


export class Palette {
  constructor() {
    this.x,this.y,this.w,this.h;

    this.atlas;
    this.scale;
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.scale = this.computePaletteScale();
    
    
  }

  computePaletteScale() {

    if(!this.atlas) return;
    
    // max possible integer multiple of TILE_SIZE that fits panel
    let maxMultiple;

    if(this.atlas.height < this.atlas.width) {
      maxMultiple = Math.floor(this.w / TILE_SIZE);
    }
    else {
      maxMultiple = Math.floor(this.h / TILE_SIZE);

    }

    const target = maxMultiple * TILE_SIZE;

     // final scale
    if(this.atlas.height < this.atlas.width)
      return target / this.atlas.width;
    else
      return target / this.atlas.height;
    
  }

  getHoveredAsset(mx, my) {

    const relX = (mx - this.x) / this.scale;
    const relY = (my - this.y) / this.scale;

    const cx = Math.floor(relX / TILE_SIZE);
    const cy = Math.floor(relY / TILE_SIZE);


    R.ui.hoveredAsset = {id: cy * TILE_COLS + cx + 1, atlasRef: R.ui.selectedPage};

  }

  checkAtlas() {
    switch(R.ui.libraryPages){
      case "WORLD_TILESET": this.atlas = R.atlas.world_tileset; break;
      case "COIN": this.atlas = R.atlas.coin; break;
      case "FRUITS": this.atlas = R.atlas.fruits; break;
      case "PLATFORMS": this.atlas = R.atlas.platforms; break;
    }

  }

// --------------------------------------------
// UPDATE — handle selection
// --------------------------------------------
  update(a) {
    this.atlas = a;
    
    const m = R.input.mouse;
    if (!this.atlas) return;
    
    const drawW = this.atlas.width  * this.scale;
    const drawH = this.atlas.height * this.scale;

    this.getHoveredAsset(m.x, m.y);

    const inside =
      m.x >= this.x && m.x < this.x + drawW &&
      m.y >= this.y && m.y < this.y + drawH;
    R.cursor.inPalette = inside;
    // --------------------------------------------
    // INPUT CHECK (to-refactor-in-future)
    // --------------------------------------------

    if (inside && m.pressed && m.button === 'left') {
      
      R.ui.selectedAsset = R.ui.hoveredAsset;

    }
  }

// --------------------------------------------
// RENDER — draw sheet + highlight
// --------------------------------------------
  render(g) {
    
    if (!this.atlas) return;

    g.push();
    
    g.noStroke();
    g.fill(0,0,0,150);
    g.rect(this.x, this.y, this.w, this.h);

    const drawW = this.atlas.width  * this.scale;
    const drawH = this.atlas.height * this.scale;

    this.checkAtlas();
    g.image(this.atlas, this.x, this.y, drawW, drawH);

    this.drawCursor(g);

    g.pop();
  }

  drawCursor(g) {

    if (R.cursor.inPalette) {
      const z = R.ui.hoveredAsset.id - 1;
      const col = z % TILE_COLS;
      const row = Math.floor(z / TILE_COLS);
      const hx = this.x + col * TILE_SIZE * this.scale;
      const hy = this.y + row * TILE_SIZE * this.scale;
      const hex1 = "#00ffff";
      g.push();
          g.noFill();
          g.stroke(hex1); g.strokeWeight(2);
          g.rect(hx, hy, TILE_SIZE * this.scale, TILE_SIZE * this.scale);
          g.pop();

    
      
    }
    const selectId = R.ui.selectedAsset.id;
    if (selectId && (R.ui.selectedAsset.atlasRef === this.atlas)) { // highlight after selection
        const hex2 = "#ffff00";
        const z = selectId - 1;
        const col = z % TILE_COLS;
        const row = Math.floor(z / TILE_COLS);
        const hx = this.x + col * TILE_SIZE * this.scale;
        const hy = this.y + row * TILE_SIZE * this.scale;
        g.push();
          g.noFill();
          g.stroke(hex2); g.strokeWeight(2);
          g.rect(hx, hy, TILE_SIZE * this.scale, TILE_SIZE * this.scale);
          g.pop();
    }


  }
  
}


