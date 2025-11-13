// ─────────────────────────────────────────────────────────────────────────────
// [GAME] Runtime rendering — camera, layers, entities, HUD
// ─────────────────────────────────────────────────────────────────────────────
import { R } from '../core/runtime.js';
import { drawLayer } from '../core/renderer.js';
// import { Dino } from './dino.js'; // if you spawn here

// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Frame pipeline (game)
// 1) camera follow with easing (snap to integers to avoid seams)
// 2) draw layers: ground → detail → decoration
// 3) draw entities/effects
// 4) HUD/debug overlays
// ─────────────────────────────────────────────────────────────────────────────
export function updateGame(p, { gWorld, gOverlay, gHUD }) {
  
}

export function renderGame( p, { gWorld, gOverlay, gHUD }) {

}
