import { R } from "../../core/runtime.js";


export class topBarContainer {

  constructor(x, y, w, h) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.hovered = false;
    this.buttons = []; 
    this.initButtons();
  
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  initButtons() {
    const pages = [
      { label: "world_tileset", page: "WORLD_TILESET" },
      { label: "coin", page: "COIN" },
      { label: "fruits", page: "FRUITS" },
    ];

    for (let p of pages) {

      this.buttons.push( new Button(p.label, p.page) );
      
    }
  }

  update() {

    this.updateButtons();
    this.checkButtonHover();
    
  }

  checkButtonHover() {

    const m = R.input.mouse;

    for(const btn of this.buttons) {
      const inside = m.x >= btn.x && m.x <= btn.x + btn.w 
                  && m.y >= btn.y && m.y <= btn.y + btn.h;

      btn.hovered = inside;
      this.checkButtonInput(btn, m);
      
    }

  }

  checkButtonInput(btn, m) {
    if( btn.hovered && m.pressed && m.button === "left") {
        R.ui.libraryPages = btn.page;
      }
  }

  updateButtons() {
    const count = this.buttons.length;
    const bw = this.w / count;

    this.buttons.forEach((btn, i) => {

      btn.x = this.x + i * bw;
      btn.y = this.y;
      btn.w = bw;
      btn.h = this.h;
      
    });
  }

  render(g) {
    if(!g) return;
    g.push();g.noStroke();
    g.fill(25);
    g.rect(this.x, this.y ,this.w, this.h);
      

    for (const btn of this.buttons) {
      
      btn.render(g);
    }

    g.pop();

  }

}

class Button {

  constructor(l = null, p = null, x = null, y = null, w = null, h = null) {
    this.label = l;
    this.page = p;

    this.x    = x;
    this.y    = y;
    this.w    = w;
    this.h    = h;

    this.hovered = false;
    
  }

  render(g) {

    if(!g) return;
    g.push();
    let bg = 100;
      if(this.hovered) bg = 0;
      g.fill(bg);
      
      g.rect(this.x, this.y, this.w, this.h);

      g.textAlign(g.CENTER, g.CENTER);
      g.textSize(14);
      g.fill("orange");
      
      g.text(this.label, this.x + this.w/2, this.y+ this.h/2);
    g.pop();

  }

}