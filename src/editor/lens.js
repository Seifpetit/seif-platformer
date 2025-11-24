import {R} from '../core/runtime.js';

export const LENS = {
  BUILD: "build",
  TIMELINE: "timeline",
  LIBRARY: "library",
};

export const LENS_CONFIG = {
  build: {
    viewport: "grid",
    rightPanel: "palette",
    bottomDock: "tools",
  },
  timeline: {
    viewport: "preview",
    rightPanel: "tracks",
    bottomDock: "timelineEditor",
  },
  library: {
    viewport: "preview",
    rightPanel: "events",
    bottomDock: "actions",
  },
};

R.ui = R.ui || {};
R.ui.lens = LENS.BUILD;

//_____________________________________________________
// [CHANGE LENS]
//_____________________________________________________

export function setLens(mode) {
  if (mode === R.ui.lens) return; // no change

  R.ui.lens = mode;
  updatePanelContents();
}

export function updatePanelContents() {
  const lens = R.ui.lens;
  const cfg = LENS_CONFIG[lens];

  R.ui.viewport = cfg.viewport;
  R.ui.rightPanel = cfg.rightPanel;
  R.ui.bottomDock = cfg.bottomDock;

}