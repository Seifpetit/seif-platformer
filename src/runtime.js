// ─────────────────────────────────────────────────────────────────────────────
// [RUNTIME] Central shared state (single source of truth)
// ─────────────────────────────────────────────────────────────────────────────
export const R = {
  mode: 'builder',                 // 'game' | 'builder'
  atlas: null,                     // p5.Image (tile_sheet.png)

  // GAME state
  level: null,                     // { width, height, layers{...} }
  camX: 0, camY: 0,
  dino: null,

  // BUILDER state
  builder: {
    level: null,                   // separate editor map
    selectedId: 1,
    paletteScroll: 0,
    padX: 20,
    panelCols: 8,
  },

  // housekeeping
  RESET_FRAMES: 0,
  SHOW_TREE_PREVIEW: false,
};
