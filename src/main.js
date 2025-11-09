// ─────────────────────────────────────────────────────────────────────────────
// [APP] Bootstrapping & Runtime Orchestration
// - Responsible for: asset preload, canvas setup, main draw loop
// - Owns camera, toggles, and level switching
// - Renders tile layers in order, then entities/effects, then debug overlays
// ─────────────────────────────────────────────────────────────────────────────
import { R } from './runtime.js';
import { loadLevel } from './levelLoader.js';
import { drawBuilder, builderKey, builderMouse, builderWheel, builderMouseHeld } from './builder.js';
import { drawGame, gameKey, gameMouse, gameWheel } from './game.js';

// ─────────────────────────────────────────────────────────────────────────────
// [LIFECYCLE] preload/setup
// preload → load images/assets
// setup   → create canvas, tune pixel mode, load initial data
// ─────────────────────────────────────────────────────────────────────────────
new window.p5(p => {
  let gWorld, gOverlay, gHUD;

  p.preload = () => {
    R.atlas = p.loadImage('./src/assets/tile_sheet.png');
  };

  p.setup = async () => {
    p.createCanvas(window.innerWidth - R.builder.padX, window.innerHeight - R.builder.padX); // "- R.builder.padX" //TEMP
    p.noSmooth(); p.pixelDensity(1);

    // offscreen layers
    gWorld   = p.createGraphics(p.width, p.height);
    gOverlay = p.createGraphics(p.width, p.height);
    gHUD     = p.createGraphics(p.width, p.height);

    // Game: initial level
    R.level = await loadLevel('./levels/level2.json');

    // Builder: blank map
    const W = 44, H = 24;  //W for nb of grid's columns , H for nb of rows 
    R.builder.level = {
      width: W, height: H,
      layers: {
        ground:     new Array(W*H).fill(0),
        detail:     new Array(W*H).fill(0),
        collision:  new Array(W*H).fill(0),
        decoration: new Array(W*H).fill(0),
      }
    };
  };

  // ───────────────────────────────────────────────────────────────────────────
  // [LOOP] Frame pipeline
  // 1) early exit if assets/levels not ready
  // 2) mode dispatch (builder vs game)
  // 3) clear + composite: world → overlay → HUD
  // ───────────────────────────────────────────────────────────────────────────
  p.draw = () => {
    if (R.RESET_FRAMES > 0) { p.clear(); R.RESET_FRAMES--; }

    gWorld.clear(); gOverlay.clear(); gHUD.clear();

    if (R.mode === 'builder') drawBuilder(p, { gWorld, gOverlay, gHUD });
    else                      drawGame(p,    { gWorld, gOverlay, gHUD });

    if (R.mode === 'builder' && p.mouseIsPressed) {
      builderMouseHeld(p);
    }


    p.clear();
    p.image(gWorld,   0, 0);
    p.image(gOverlay, 0, 0);
    p.image(gHUD,     0, 0);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // [INPUT] Dev hotkeys
  // Z/Space = jump (in game), B/G = switch mode
  // ───────────────────────────────────────────────────────────────────────────
  p.keyPressed   = () => (R.mode === 'builder' ? builderKey(p)   : gameKey(p));
  p.mousePressed = () => (R.mode === 'builder' ? builderMouse(p) : gameMouse(p));

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    [gWorld, gOverlay, gHUD].forEach(g => g.resizeCanvas(p.width, p.height));
  };
});
