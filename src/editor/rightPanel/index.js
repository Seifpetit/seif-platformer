// palette.js
import { R } from "../../core/runtime.js";
import { BarContainer } from "./barContainer.js";
import { ContentContainer } from "./contentContainer.js";

const rightPanel = {
  pageBar: new BarContainer(),
  pageContent: new ContentContainer()
}

export function updateRightPanel() {

  const PANEL = R.layout.panels.rightPanel;
  const BAR_HEIGHT = 50;
  const BAR_X = PANEL.x;
  const BAR_Y = PANEL.y;
  const BAR_W = PANEL.w;
  const BAR_H = BAR_HEIGHT;


  rightPanel.pageBar.setGeometry(BAR_X, BAR_Y, BAR_W, BAR_H);
  rightPanel.pageContent.setGeometry(PANEL.x, BAR_H, PANEL.w, PANEL.h - BAR_HEIGHT);

  rightPanel.pageBar.update();
  rightPanel.pageContent.update();

}

export function renderRightPanel(g) {
  rightPanel.pageBar.render(g);
  rightPanel.pageContent.render(g);
}




