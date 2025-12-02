// palette.js
import { R } from "../../core/runtime.js";
import { topBarContainer } from "./topBarContainer.js";
import { sideBarContainer } from "./sideBarContainer.js";
import { ContentContainer } from "./contentContainer.js";



const rightPanel = {

  pagesBar: new topBarContainer(),
  
  pageContent: new ContentContainer(),

  booksBar: new sideBarContainer(),

}


export function updateRightPanel() {

  const PANEL = R.layout.panels.rightPanel;
  const PAD = R.layout.pad;

  const TOP_BAR_X = PANEL.x;
  const TOP_BAR_Y = PANEL.y;
  const TOP_BAR_W = PANEL.w;
  const TOP_BAR_H = PAD;

  const SIDE_BAR_W = PAD;
  const SIDE_BAR_Y = PANEL.y;
  const SIDE_BAR_X = PANEL.x - SIDE_BAR_W;
  const SIDE_BAR_H = PANEL.h;
    
 
  rightPanel.booksBar.setGeometry(SIDE_BAR_X, SIDE_BAR_Y, 
                                 SIDE_BAR_W, SIDE_BAR_H);
  
  rightPanel.pagesBar.setGeometry(TOP_BAR_X, TOP_BAR_Y, 
                                TOP_BAR_W, TOP_BAR_H);
  
  rightPanel.pageContent.setGeometry(PANEL.x, TOP_BAR_H, PANEL.w, 
                                    PANEL.h - TOP_BAR_H);
                                 

  rightPanel.booksBar.update();
  rightPanel.pagesBar.update();
  rightPanel.pageContent.update();

}

export function renderRightPanel(g) {
  rightPanel.booksBar.render(g);
  rightPanel.pagesBar.render(g);
  rightPanel.pageContent.render(g);
}




