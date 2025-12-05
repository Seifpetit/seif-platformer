// ─────────────────────────────────────────────────────────────────────────────
// [APP] Bootstrapping & Runtime Orchestration
// - Responsible for: asset preload, canvas setup, main draw loop
// - Owns camera, toggles, and level switching
// - Renders tile layers in order, then entities/effects, then debug overlays
// ─────────────────────────────────────────────────────────────────────────────
import { R, updatePanelLayout, initRuntime} from './core/runtime.js';
import { loadLevel } from './core/levelLoader.js';
import { updateFrame, renderFrame } from './core/orchestrator.js';
import { registerKeyboard } from './core/input.js';
import { TILE_SIZE } from './core/tileset.js';
import { importAudioFile } from './core/importAudio.js';
// ─────────────────────────────────────────────────────────────────────────────
// [LIFECYCLE] preload/setup
// preload → load images/assets
// setup   → create canvas, tune pixel mode, load initial data
// ─────────────────────────────────────────────────────────────────────────────
new window.p5(p => {
  let gWorld, gOverlay, gHUD;

  p.preload = () => {
    R.atlas.world_tileset = p.loadImage("src/assets/world_tileset.png");
    R.atlas.coin = p.loadImage("src/assets/coin.png");
    R.atlas.fruits = p.loadImage("src/assets/fruit.png");
    R.atlas.knight = p.loadImage("src/assets/knight.png");
    R.atlas.platforms = p.loadImage("src/assets/platforms.png");
    R.atlas.slime_green = p.loadImage("src/assets/slime_green.png");
    R.atlas.slime_purple = p.loadImage("src/assets/slime_purple.png");


    R.layout.assets.cursor_k = p.loadImage("src/assets/pointer_k.png");
    R.layout.assets.cursor_j = p.loadImage("src/assets/pointer_j.png");
    R.layout.assets.cursor_b = p.loadImage("src/assets/pointer_b.png");
  };

  p.setup = async () => {
    p.createCanvas(window.innerWidth - R.layout.pad, window.innerHeight - R.layout.pad); // "- R.layout.padX" //TEMP
    p.noSmooth(); p.pixelDensity(1); p.canvas.style.cursor = 'none';

    // offscreen layers
    gWorld   = p.createGraphics(p.width, p.height);
    
    gOverlay = p.createGraphics(p.width, p.height);
    gHUD     = p.createGraphics(p.width, p.height);

    // Game: initial level
    R.level = await loadLevel('./levels/level2.json');

    // layout: blank map
    const W = 44, H = 24;  //W for nb of grid's columns , H for nb of rows 
    R.layout.level = {
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
      const insideGrid = x >= R.layout.panels.viewport.x && x < R.layout.panels.viewport.x + R.layout.panels.viewport.w &&
                         y >= R.layout.panels.viewport.y && y < R.layout.panels.viewport.y + R.layout.panels.viewport.h;

      if (insideGrid) e.preventDefault();
    
    });

    let dragTimer = null;

    window.addEventListener("dragover", e => {
      e.preventDefault();

      R.ui.dragActive = true;

      // reset timer
      clearTimeout(dragTimer);
      dragTimer = setTimeout(() => {
          R.ui.dragActive = false;
      }, 100); // 100ms without dragover = drag ended

    });

    window.addEventListener("drop", e => {
        e.preventDefault();

        clearTimeout(dragTimer);
        R.ui.dragActive = false;

        const files = e.dataTransfer.files;
        for (let f of files) {
            if (f.type.startsWith("audio/")) {
                importAudioFile(f);
            }
        }
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
    

    if (R.layout.assets.cursor_j && !R.cursor.inPalette && !R.cursor.inAudio && !R.cursor.inBottomDock) {

      p.image(R.layout.assets.cursor_j, R.cursor.x, R.cursor.y, TILE_SIZE, TILE_SIZE);
      if (!R.cursor.inGrid) {
        p.push();
        p.noFill();
        p.stroke(255, 255, 0, 180); p.strokeWeight(2);
        p.rect(R.cursor.x, R.cursor.y, TILE_SIZE, TILE_SIZE);
        p.pop();
      }
    }

    if(R.layout.assets.cursor_b && (R.cursor.inAudio ||R.cursor.inBottomDock)) {
      p.image(R.layout.assets.cursor_b, R.cursor.x, R.cursor.y, 20, 20);
   
    }



  };

  // prevent context menu (so right-click erases)
  p.canvas?.addEventListener?.('contextmenu', e => e.preventDefault());

  p.windowResized = () => {
    p.resizeCanvas(window.innerWidth, window.innerHeight);
    updatePanelLayout(p);
    [gWorld, gOverlay, gHUD].forEach(g => g.resizeCanvas(p.width, p.height));
  };
  
});
