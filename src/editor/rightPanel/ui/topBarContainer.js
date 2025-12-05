import { R } from "../../../core/runtime.js";

export class topBarContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;
    this.buttons = [];
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
    this.updateButtonGeometry();
  }

  setButtons(list) {
    this.buttons = list.map(p => new Button(p.label, p.page));
    this.updateButtonGeometry();
  }

  updateButtonGeometry() {
    const count = this.buttons.length;
    if (count === 0) return;

    const bw = this.w / count;
    this.buttons.forEach((btn, i) => {
      btn.x = this.x + i * bw;
      btn.y = this.y;
      btn.w = bw;
      btn.h = this.h;
    });
  }

  update() {
    this.buttons.forEach(btn => btn.update());
  }

  render(g) {
    g.push();
    g.fill(30);
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    this.buttons.forEach(btn => btn.render(g));
    g.pop();
  }
}

class Button {

  constructor(label, page) {
    this.label = label;
    this.page  = page;
    this.x = this.y = this.w = this.h = 0;
  }

  update() {
    const m = R.input.mouse;

    const inside =
      m.x >= this.x && m.x <= this.x + this.w &&
      m.y >= this.y && m.y <= this.y + this.h;

    if (inside && m.pressed && m.button === "left") {
      R.ui.selectedPage = this.page;
    }
  }

  render(g) {
    const isActive = (R.ui.selectedPage === this.page);

    g.push();

    g.fill(isActive ? "#ffaa00" : "#444");
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 0, 0);

    g.fill(isActive ? "black" : "orange");
    g.textAlign(g.CENTER, g.CENTER);
    g.text(this.label, this.x + this.w/2, this.y + this.h/2);

    g.pop();
  }
}
