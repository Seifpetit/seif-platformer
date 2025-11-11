// ─────────────────────────────────────────────────────────────────────────────
// [GAME] Runtime rendering — camera, layers, entities, HUD
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { drawLayer } from '../core/levelLoader.js';
// import { Dino } from './dino.js'; // if you spawn here

// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Frame pipeline (game)
// 1) camera follow with easing (snap to integers to avoid seams)
// 2) draw layers: ground → detail → decoration
// 3) draw entities/effects
// 4) HUD/debug overlays
// ─────────────────────────────────────────────────────────────────────────────
export function drawGame(p, { gWorld, gOverlay, gHUD }) {
  const L = R.level;
  if (!L) {
    gHUD.fill(0); gHUD.textAlign(gHUD.CENTER, gHUD.CENTER);
    gHUD.text('Loading…', p.width/2, p.height/2);
    return;
  }

  gWorld.background(99,173,255);

  // camera
  if (R.dino) {
    const target = Math.max(0, R.dino.x - p.width / 3);
    R.camX = Math.floor(R.camX + (target - R.camX) * 0.15);
  } else {
    R.camX = Math.floor(R.camX); R.camY = Math.floor(R.camY);
  }

  // tile layers
  drawLayer(gWorld, R.atlas, L.layers.ground,     L.width, L.height, R.camX, R.camY);
  drawLayer(gWorld, R.atlas, L.layers.detail,     L.width, L.height, R.camX, R.camY);
  drawLayer(gWorld, R.atlas, L.layers.decoration, L.width, L.height, R.camX, R.camY);

  // entities
  if (R.dino) { R.dino.update(p); R.dino.draw(gWorld, R.camX, R.camY); }

  // HUD
  gHUD.fill(255); gHUD.noStroke(); gHUD.textAlign(gHUD.LEFT, gHUD.TOP);
  gHUD.text('MODE: GAME  (press B for builder)', 10, 10);
}

// ─────────────────────────────────────────────────────────────────────────────
// [INPUT] Mouse/Keys (game)
// ─────────────────────────────────────────────────────────────────────────────
export function gameWheel() {}
export function gameMouse(p) {}
export function gameKey(p) {
  const k = p.key.toLowerCase();
  if (k === 'b') { R.mode = 'builder'; R.RESET_FRAMES = 2; }
  if (k === ' ' || k === 'z') R.dino?.jump?.();
}
