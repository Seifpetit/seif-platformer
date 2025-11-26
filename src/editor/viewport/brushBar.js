import { R } from "../../core/runtime.js";


export class BrushBar {

  constructor() {
    this.x, this.y, this.w, this.h;
    this.brushes = [];

    this.initBrushes();
  }

  initBrushes() {
    const BRUSHES = [
      {mode: "PAINT", label: "Paint"},
      {mode: "ERASE", label: "Erase"},
      {mode: "SELECT", label: "Select"},
      {mode: "FILL", label: "Fill"},
    ];

    for (let b of BRUSHES) {
      this.brushes.push(new Brush(b.mode, b.label));
    }
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {

    this.updateBrushes();
    this.checkBrushHover();
    
  }

  checkBrushHover() {

    const m = R.input.mouse;

    for(const brsh of this.brushes) {
      const inside = m.x >= brsh.x && m.x <= brsh.x + brsh.w 
                  && m.y >= brsh.y && m.y <= brsh.y + brsh.h;

      brsh.hovered = inside;
      this.checkBrushInput(brsh, m);
      
    }

  }

  checkBrushInput(brsh, m) {
    if( brsh.hovered && m.pressed && m.button === "left") {
        R.ui.brushMode = brsh.mode;
      }
  }

  updateBrushes() {
    const count = this.brushes.length;
    const bw = this.w / count;

    this.brushes.forEach((brsh, i) => {

      brsh.x = this.x + i * bw;
      brsh.y = this.y;
      brsh.w = bw;
      brsh.h = this.h;
      
    });
  }
  
  render(g) {
    if(!g) return;
        g.push();g.noStroke();
        g.fill("purple");
        g.rect(this.x, this.y ,this.w, this.h);
    
        g.fill(200);
        g.textAlign(g.LEFT, g.TOP);
        g.textSize(16);
    
        const label = " Brushes CONTAINER";
    
        g.text(label, this.x + 12, this.y + 12);

        for (const brsh of this.brushes) {
          brsh.render(g);
        }
    
        g.pop();
  }

}

class Brush {

  constructor(m = null, l = null, x = null, y = null, w = null, h = null) {
    this.label = l;
    this.mode = m;

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


      g.textSize(14);
      g.fill("orange");
      
      g.text(this.mode, this.x + this.w/2, this.y+ this.h/2);
    g.pop();

  }

}