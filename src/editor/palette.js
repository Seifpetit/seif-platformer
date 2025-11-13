// ─────────────────────────────────────────────
// [EDITOR] Palette
// - Displays the raw tilesheet (atlas) on the right
// - Handles tile selection via mouse input
// - Uses R.panels.palette for positioning
// - Updates R.builder.selectedId
// ─────────────────────────────────────────────
import { R } from "../core/runtime.js";
import { TILE_SIZE, TILE_COLS } from "../core/tileset.js";

// ─────────────────────────────────────────────
// [UPDATE] Mouse interaction (select tile)
// ─────────────────────────────────────────────
export function updatePalette(p) {

  const atlas = R.atlas;
  const m = R.input.mouse;
  const P = R.builder.panels.palette;

  

  if (!atlas || !P || !R.atlas || R.atlas.width === 0 || R.atlas.height === 0) return;

  // Check if click inside palette panel
  const inside = m.x >= P.x && m.x < P.x + P.w && m.y >= P.y && m.y < P.y + P.h;

  if ( inside && m.pressed && m.button === 'left') {

    const cx = Math.floor((m.x - P.x) / TILE_SIZE);
    const cy = Math.floor((m.y - P.y) / TILE_SIZE);

    // Prevent overflow for incomplete rows
    if (cy * TILE_SIZE < atlas.height) {
      const id = cy * TILE_COLS + cx + 1;
      R.builder.selectedId = id;
    }
  }
}

// ─────────────────────────────────────────────
// [RENDER] Draw tilesheet & highlight
// ─────────────────────────────────────────────
export function renderPalette(g) {

  const atlas = R.atlas;
  const P = R.builder.panels.palette;

  if (!atlas || !P || !R.atlas || R.atlas.width === 0 || R.atlas.height === 0) return;

  g.push();

  // 1️⃣ Background panel
  g.noStroke();
  g.fill(0, 0, 0, 150);
  g.rect(P.x, P.y, P.w, P.h);

  // 2️⃣ Tilesheet image
  g.noTint?.();
  g.image(atlas, P.x, P.y);

  // 3️⃣ Highlight selected tile
  const id = R.builder.selectedId;
  if (id) {
    const z = id - 1;
    const col = z % TILE_COLS;
    const row = Math.floor(z / TILE_COLS);
    const hx = P.x + col * TILE_SIZE;
    const hy = P.y + row * TILE_SIZE;

    g.noFill();
    g.stroke(255, 255, 0);
    g.strokeWeight(1);
    g.rect(hx, hy, TILE_SIZE, TILE_SIZE);
  }

  g.pop();

}
