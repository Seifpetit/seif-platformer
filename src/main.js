// ─────────────────────────────────────────────────────────────────────────────
// [APP] Bootstrapping & Runtime Orchestration
// - Responsible for: asset preload, canvas setup, main draw loop
// - Owns camera, toggles, and level switching
// - Renders tile layers in order, then entities/effects, then debug overlays
// ─────────────────────────────────────────────────────────────────────────────
import { R, updatePanelLayout } from './core/runtime.js';
import { loadLevel } from './core/levelLoader.js';
import { updateFrame, renderFrame } from './core/orchestrator.js';
import { registerKeyboard, updateInput } from './core/input.js';


// ─────────────────────────────────────────────────────────────────────────────
// [LIFECYCLE] preload/setup
// preload → load images/assets
// setup   → create canvas, tune pixel mode, load initial data
// ─────────────────────────────────────────────────────────────────────────────
new window.p5(p => {
  let gWorld, gOverlay, gHUD;

  p.preload = () => {
    R.atlas = p.loadImage("src/assets/tile_sheet.png");
  };

  p.setup = async () => {
    p.createCanvas(window.innerWidth - R.builder.pad, window.innerHeight - R.builder.pad); // "- R.builder.padX" //TEMP
    p.noSmooth(); p.pixelDensity(1);
    
    p.image(R.atlas, 0, 0);  // draw once to ensure loaded

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

    registerKeyboard(p);
    updatePanelLayout(p);

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'o')) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('contextmenu', (e) => {
      const { offsetX: x, offsetY: y } = e;
      const insideGrid = x >= R.builder.panels.grid.x && x < R.builder.panels.grid.x + R.builder.panels.grid.w &&
                         y >= R.builder.panels.grid.y && y < R.builder.panels.grid.y + R.builder.panels.grid.h;

      if (insideGrid) e.preventDefault();
    
    });

  };

  // ───────────────────────────────────────────────────────────────────────────
  // [LOOP] Frame pipeline
  // clear + composite: world → overlay → HUD
  // ───────────────────────────────────────────────────────────────────────────
  p.draw = () => {
    p.clear(); // <── first

    updateFrame(p);
    renderFrame(p, { gWorld, gOverlay, gHUD });
    

    p.image(gWorld, 0, 0);
    p.image(gOverlay, 0, 0);
    p.image(gHUD, 0, 0);

  };

  // prevent context menu (so right-click erases)
  p.canvas?.addEventListener?.('contextmenu', e => e.preventDefault());

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    updatePanelLayout(p);
    [gWorld, gOverlay, gHUD].forEach(g => g.resizeCanvas(p.width, p.height));
  };
});
