import { R } from "../../../src/core/runtime.js";
import { Palette } from "./palette.js";


export class ContentContainer {

  constructor(x, y, h, w) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.hovered = false;
    this.pages = {    
      PALETTE: new Palette(),
    }
    this.atlas = null;
  
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

  }

  update() {  
    
    this.pages.PALETTE.setGeometry(this.x, this.y, this.w, this.h);

    
    switch(R.ui.libraryPages){
      case "WORLD_TILESET": this.atlas = R.atlas.world_tileset; break;
      case "COIN": this.atlas = R.atlas.coin; break;
      case "FRUITS": this.atlas = R.atlas.fruits; break;
      case "PLATFORMS": this.atlas = R.atlas.platforms; break;
    }
    this.pages.PALETTE.setGeometry(this.x, this.y, this.w, this.h);  
    this.pages.PALETTE.update(this.atlas);

    
  }

  render(g) {
    if(!g) return;
    g.push();g.noStroke();
    g.fill(25);
    g.rect(this.x, this.y ,this.w, this.h);
    this.pages.PALETTE.render(g);
    g.pop();

  }

}
