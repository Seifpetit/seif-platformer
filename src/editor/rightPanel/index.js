// rightPanel/index.js

import { R } from "../../core/runtime.js";

import { topBarContainer } from "./ui/topBarContainer.js";
import { sideBarContainer } from "./ui/sideBarContainer.js";
import { ContentContainer } from "./ui/contentContainer.js";

import { PAGES, PAGE_TYPES, BOOKS } from "./ui/pages.js";

// -----------------------------------------------
// Base right panel object
// -----------------------------------------------
const rightPanel = {

  booksBar: new sideBarContainer(),
  pagesBar: new topBarContainer(),
  pageContent: new ContentContainer(),

  registry: {}   // will be filled dynamically
};

// attach to R runtime
R.rightPanel = rightPanel;


// -----------------------------------------------
// Build registry dynamically from metadata
// -----------------------------------------------
export function buildRightPanelRegistry() {
  rightPanel.registry = {};

  for (const bookName in PAGES) {
    rightPanel.registry[bookName] = {};

    for (const def of PAGES[bookName]) {
      const Cls = PAGE_TYPES[def.type];
      if (!Cls) continue;

      rightPanel.registry[bookName][def.page] = new Cls(def);
    }
  }
}


// -----------------------------------------------
// Book selection logic
// -----------------------------------------------
export function onBookSelected(bookRef) {

  R.ui.selectedBook = bookRef;

  const pageList = PAGES[bookRef] || [];
  R.ui.topBarButtons = pageList;

  if (pageList.length > 0)
    R.ui.selectedPage = pageList[0].page;

  rightPanel.pagesBar.setButtons(pageList);
}


// -----------------------------------------------
// Update + Render
// -----------------------------------------------
export function updateRightPanel() {

  if (R.ui.modalLock) return;  // freeze editor input when popup active

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

  rightPanel.booksBar.setGeometry(SIDE_BAR_X, SIDE_BAR_Y, SIDE_BAR_W, SIDE_BAR_H);
  rightPanel.pagesBar.setGeometry(TOP_BAR_X, TOP_BAR_Y, TOP_BAR_W, TOP_BAR_H);
  rightPanel.pageContent.setGeometry(PANEL.x, TOP_BAR_H, PANEL.w, PANEL.h - TOP_BAR_H);

  rightPanel.booksBar.update();
  rightPanel.pagesBar.update();
  rightPanel.pageContent.update();
}

export function renderRightPanel(g) {
  rightPanel.booksBar.render(g);
  rightPanel.pagesBar.render(g);
  rightPanel.pageContent.render(g);
}


buildRightPanelRegistry();
