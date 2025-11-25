import { R } from "../../../core/runtime.js";

export class TracksContainer {

  constructor(x, y, w, h) {
    this.x = x,
    this.y = y;
    this.w = w,
    this.h = h;
    
  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update(panel) {

  }


  render(g) {
    if(!g) return;
    g.push();g.noStroke();
    g.fill("green");g.rect(this.x, this.y ,this.w, this.h);

    g.fill(200);  g.textAlign(g.LEFT, g.TOP); g.textSize(16);

    const label = R.ui.timelineMode.toUpperCase() + " TRACKS CONTAINER";

    g.text(label, this.x + 12, this.y + 12);

    g.pop();

  }

}
