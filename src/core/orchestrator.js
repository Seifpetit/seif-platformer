//[CORE] Orchestrator Module
import { R } from './runtime.js';
import { updateInput } from './input.js';
import { updateBuilder, renderBuilder } from '../modes/editor.js';
import { updateGame, renderGame } from '../modes/game.js';

export function updateFrame(p) {
  
  updateInput(p);

  switch (R.mode) {
    case "builder": updateBuilder(p); break;
    case "game"   : updateGame(p);    break;
  }

}

export function renderFrame(p, {gWorld, gOverlay,gHUD }) {

  switch (R.mode) {
    case "builder": renderBuilder( p, {gWorld, gOverlay,gHUD }); break;
    case "game"   : renderGame( p, {gWorld, gOverlay,gHUD });    break;
  }
}