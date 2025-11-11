// /editor/grid/index.js
import { drawGridLines } from './gridLines.js';
import { drawCollisionOverlay } from './gridHighlights.js';
import { R } from '../../core/runtime.js';

export function drawGrid(gOverlay) {
  drawGridLines(gOverlay);

  // optional overlays (toggled via R.builder flags)
  if (R.builder.showCollision) {
    drawCollisionOverlay(gOverlay);
  }
}
