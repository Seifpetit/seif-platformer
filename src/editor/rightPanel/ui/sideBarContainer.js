import { R } from "../../../core/runtime.js";
import { BOOKS } from "../ui/pages.js";
import { onBookSelected } from "../index.js";

export class sideBarContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
    this.buttons = [];

    for (let b of BOOKS)
      this.buttons.push(new Button(b.label, b.ref));
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update() {
    const count = this.buttons.length;
    const bh = this.h / count;

    this.buttons.forEach((btn, i) => {
      btn.setGeometry(this.x, this.y + i * bh, this.w, bh);
      btn.update();
    });
  }

  render(g) {
    if (!g) return;
    for (let btn of this.buttons) btn.render(g);
  }
}

class Button {

  constructor(label, ref) {
    this.label = label;
    this.ref   = ref;
    this.x = this.y = this.w = this.h = 0;
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update() {
    const m = R.input.mouse;

    const inside =
      m.x >= this.x && m.x <= this.x + this.w &&
      m.y >= this.y && m.y <= this.y + this.h;

    if (inside) {
      R.ui.hoveredBook = this.ref;
      if (m.pressed && m.button === "left") {
        onBookSelected(this.ref);
        R.rightPanel.book = this.ref;
      }
    }
  }

  render(g) {
    const isActive  = (R.ui.selectedBook === this.ref);
    const isHover   = (R.ui.hoveredBook === this.ref);

    g.push();
    g.noStroke();

    if (isActive) {
      g.fill("orange");
    } else if (isHover) {
      g.fill("#43321873");
    } else {
      g.fill("#262626");
    }

    g.rect(this.x, this.y, this.w, this.h, 6);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w/2, this.y + this.h/2);

    g.pop();
  }
}
