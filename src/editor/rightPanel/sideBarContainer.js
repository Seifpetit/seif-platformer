import { R } from "../../../src/core/runtime.js";


export class sideBarContainer {

  constructor(x, y, w, h) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

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
    const books = [
      { label: "Tiles", ref: "Tiles" },
      { label: "Entities", ref: "Entities" },
      { label: "Audio", ref: "Audio" },
      { label: "Logic", ref: "Logic" },
      { label: "Files", ref: "Files" },
      { label: "...", ref: "..." },
    ];

    for (let b of books) {

      this.buttons.push( new Button(b.label, b.ref) );
      
    }
    
  }

  update() {
    const count = this.buttons.length;
    const bh = this.h / count;
    const books = this.buttons;
    let i = 0;
    for (let b of books) {
      b.mouseInsideButton();
      b.setGeometry(this.x, this.y + i * bh,
                    this.w, bh
      );
      i++;
    }
    
  }

  render(g) {
    if(!g) return;
    g.push();

    for (const btn of this.buttons) {
      if(btn.book === R.ui.selectedBook) btn.renderSelectedBook(g);
      else if(btn.book === R.ui.hoveredBook) {btn.renderHoveredBook(g)}
      else {btn.renderRestBooks(g);}

    }

    g.pop();

  }

}

class Button {

  constructor(l = null, b = null, x = null, y = null, w = null, h = null) {
    this.label = l;
    this.book = b;

    this.x    = x;
    this.y    = y;
    this.w    = w;
    this.h    = h;

    
  }

  mouseInsideButton() {

    const m = R.input.mouse;
      if (this.x === null || this.y === null || this.w === null || this.h === null) {
        R.ui.hoveredBook = null;
        return;
      }
      let insideBar = false;
      const inside = m.x >= this.x && m.x <= this.x + this.w 
                  && m.y >= this.y && m.y <= this.y + this.h;
      if(inside) {
        R.ui.hoveredBook = this.book;
        this.checkButtonInput(inside, m);
        return insideBar = true;
      }
      return insideBar;
      
      
  }

  checkButtonInput(inside, m) {
    if( inside && m.pressed && m.button === "left") {
        R.ui.selectedBook = R.ui.hoveredBook;
      }
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  renderHoveredBook(g) {
    if(!g) return;
    g.push();
    const TLradius = 3;
    const TRradius = 3;
    const BRradius = 3;
    const BLradius = 12;

    let bg = 100;
    g.stroke("#1d1d1dff");g.strokeWeight(2);g.strokeCap("ROUND");
      g.fill("#d59c3fab");
      g.rect(this.x, this.y, this.w, this.h,
              TLradius, TRradius, BRradius, BLradius);
              

      g.fill("#000000ff");g.noStroke();
      g.textAlign(g.VERTICAL);
      g.textAlign(g.CENTER, g.CENTER);
      g.textSize(14);
      
      
      g.text(this.label, this.x + this.w/2, this.y+ this.h/2);
    g.pop();
  }

  renderRestBooks(g) {
    if(!g) return;
    g.push();
    const TLradius = 3;
    const TRradius = 3;
    const BRradius = 3;
    const BLradius = 12;

    let bg = 100;
    g.stroke("#fc9714ff");g.strokeWeight(2);g.strokeCap("ROUND");
      g.fill("#26262648");
      g.rect(this.x, this.y, this.w, this.h,
              TLradius, TRradius, BRradius, BLradius);
              

      g.fill("#463d31ff");g.noStroke();
      g.textAlign(g.VERTICAL);
      g.textAlign(g.CENTER, g.CENTER);
      g.textSize(14);
      
      
      g.text(this.label, this.x + this.w/2, this.y+ this.h/2);
    g.pop();

  }

  renderSelectedBook(g) {
    if(!g) return;
    g.push();
    const TLradius = 3;
    const TRradius = 3;
    const BRradius = 3;
    const BLradius = 12;

    let bg = 100;
    g.stroke("#1d1d1dff");g.strokeWeight(2);g.strokeCap("ROUND");
      g.fill("orange");
      g.rect(this.x, this.y, this.w, this.h,
              TLradius, TRradius, BRradius, BLradius);
              

      g.fill("#000000ff");g.noStroke();
      g.textAlign(g.VERTICAL);
      g.textAlign(g.CENTER, g.CENTER);
      g.textSize(14);
      
      
      g.text(this.label, this.x + this.w/2, this.y+ this.h/2);
    g.pop();
  }

}