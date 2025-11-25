import { R } from "../../../core/runtime.js";
import { ToolsContainer } from "./toolsContainer.js";
import { TracksContainer } from "./tracksContainer.js"

const timelinePanel = {
  toolsContainer: new ToolsContainer(),
  tracksContainer: new TracksContainer(),
}

export class TimelinePanel {

  constructor(x, y, h, w) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;



  }


  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    
    const RATIO = 1/3;
    const PAD   = R.layout.pad * RATIO;

    const TOOLS_X = this.x + PAD;
    const TOOLS_Y = this.y + PAD;
    const TOOLS_W = (this.w - PAD) * RATIO;
    const TOOLS_H = this.h - PAD * 2;

    const TRACKS_X = TOOLS_X + TOOLS_W + PAD;
    const TRACKS_Y = this.y + PAD;
    const TRACKS_W = this.w - TRACKS_X - PAD;
    const TRACKS_H = this.h - PAD * 2;

    timelinePanel.toolsContainer.setGeometry(TOOLS_X, TOOLS_Y, TOOLS_W, TOOLS_H);
    timelinePanel.tracksContainer.setGeometry(TRACKS_X, TRACKS_Y, TRACKS_W, TRACKS_H);

  }

  update(panel) {
    timelinePanel.toolsContainer.update(panel);
    timelinePanel.tracksContainer.update(panel);
  }


  render(g) {
    if(!g) return;

    g.push(); g.noStroke();
    g.fill(25); g.rect(this.x, this.y ,this.w, this.h);
    g.fill(200);  g.textAlign(g.LEFT, g.TOP); g.textSize(16);

    const label = R.ui.timelineMode.toUpperCase() + " TIMELINE";
    g.text(label, this.x + 12, this.y + 12);

    timelinePanel.toolsContainer.render(g);
    timelinePanel.tracksContainer.render(g);


    g.pop();

  }

}

