// ─────────────────────────────────────────────────────────────────────────────
// [APP] Bootstrapping & Runtime Orchestration
// - Responsible for: asset preload, canvas setup, main draw loop
// - Owns camera, toggles, and level switching
// - Renders tile layers in order, then entities/effects, then debug overlays
// ─────────────────────────────────────────────────────────────────────────────

  import { loadLevel, drawLayer } from './levelLoader.js';
  import { TILE_SIZE } from './tileset.js';
  import { Dino } from './dino.js';
  import { drawTree } from './tileset.js';

// ─────────────────────────────────────────────────────────────────────────────
// [STATE] Global runtime state (owned by main loop)
// atlas   → loaded spritesheet
// level   → current level data & dense layer arrays
// dino    → player entity instance
// camX/Y  → camera position in pixels (snapped to avoid seams)
// SHOW_TREE_PREVIEW → temporary dev overlay for composed trees
// ─────────────────────────────────────────────────────────────────────────────

  let atlas;         // tile_sheet.png
  let level = null;  // loaded JSON level
  let dino;
  let camX = 0, camY = 0;
  let SHOW_TREE_PREVIEW = true; // Toggle to show/hide the tree preview

// ─────────────────────────────────────────────────────────────────────────────
// [LIFECYCLE] preload/setup
// preload → load images/assets
// setup   → create canvas, tune pixel mode, load initial level
// ─────────────────────────────────────────────────────────────────────────────

function preload(p) {
  atlas = p.loadImage('./src/assets/tile_sheet.png');
}

function setup(p) {
  p.createCanvas(p.windowWidth, p.windowHeight);

  // Pixel-perfect rendering (kills seams)
  p.noSmooth();
  p.pixelDensity(1);

  loadLevelByName('level2');
}

// ─────────────────────────────────────────────────────────────────────────────
// [INPUT] Dev hotkeys
// Z/Space = jump, T = toggle tree preview, 1/2 = switch level
// ─────────────────────────────────────────────────────────────────────────────

  function keyPressed(p) {
    if (p.keyCode === 90 || p.keyCode === 32) dino?.jump(); // Z / Space
    if (p.key === 't' || p.key === 'T') SHOW_TREE_PREVIEW = !SHOW_TREE_PREVIEW;
    if (p.key === '1') loadLevelByName('level1');
    if (p.key === '2') loadLevelByName('level2');
  }

// ─────────────────────────────────────────────────────────────────────────────
// [P5] Instance-mode binding (no globals bleeding into window scope)
// ─────────────────────────────────────────────────────────────────────────────

  new window.p5(p => {
    p.preload     = () => preload(p);
    p.setup       = () => setup(p);
    p.draw        = () => draw(p);
    p.keyPressed  = () => keyPressed(p);
  });

// ─────────────────────────────────────────────────────────────────────────────
// [HELPER] Level loader by logical name
// Resets cam + spawns Dino at default for demo
// ─────────────────────────────────────────────────────────────────────────────

  function loadLevelByName(name) {
    loadLevel(`./levels/${name}.json`).then(l => {
      level = l;
      dino = new Dino(24, 324);
      // optional: recenter camera
      camX = 0; camY = 0;
    });
  }

// ─────────────────────────────────────────────────────────────────────────────
// [DEV PREVIEW] drawTree samples
// Composes canopy+trunk sets to validate art alignment
// Remove in production or behind a debug flag
// gx, gy are GRID coords (cells), not pixels.
// drawTree signature: drawTree(p, atlas, gx, gy, spec, { camX, camY })
// ─────────────────────────────────────────────────────────────────────────────

function treePreview(p) {
  // Use matching families for cleaner look (A with A, B with B)

  drawTree(
    p, atlas, 10, 6,
    { top: 'A3', mid: 'A3', trunk: 'R10', width: 5, midRows: 2, trunkRows: 5 },
    { camX, camY }
  );

  drawTree(
    p, atlas, 20, 7,
    { top: 'A1', mid: 'A1', trunk: 'R7', width: 6, midRows: 1, trunkRows: 6 },
    { camX, camY }
  );

  drawTree(
    p, atlas, 28, 5,
    { top: 'B2', mid: 'B2', trunk: 'R12', width: 4, midRows: 2, trunkRows: 4 },
    { camX, camY }
  );
}

// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// [LOOP] Frame pipeline
// 1) early exit if level not ready
// 2) camera follow with easing (snap to integers to avoid seams)
// 3) draw layers in strict order: ground → detail → decoration
// 4) draw dev previews (trees) then entities (dino)
// 5) later: post FX / UI / debug
// ─────────────────────────────────────────────────────────────────────────────

  function draw(p) {
    p.background(99, 173, 255);

    if (!level) {
      p.fill(0); p.textAlign(p.CENTER, p.CENTER);
      p.text('Loading…', p.width / 2, p.height / 2);
      return;
    }

    // Camera follow + easing
    if (dino) {
      const target = Math.max(0, dino.x - p.width / 3);
      camX += (target - camX) * 0.15;
    }

    // Snap camera to whole pixels to avoid hairline seams
    camX = Math.floor(camX);
    camY = Math.floor(camY);

    // World layers
    drawLayer(p, atlas, level.layers.ground,     level.width, level.height, camX, camY);
    drawLayer(p, atlas, level.layers.detail,     level.width, level.height, camX, camY);
    drawLayer(p, atlas, level.layers.decoration, level.width, level.height, camX, camY);

    // --- TEMP: draw a few sample trees on top of the map -----------------
    //if (SHOW_TREE_PREVIEW) treePreview(p);
    // ---------------------------------------------------------------------

    if (dino) { dino.update(p); dino.draw(p, camX, camY); }
  }

  // ─────────────────────────────────────────────────────────────────────────────