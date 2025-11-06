import { TILE_SIZE, TILE_COLS, id as idOf, fromId } from './tileset.js';

let atlas;
let camX = 0, camY = 0;
let dragging = false;
let dragStart = { x: 0, y: 0 };
let camStart = { x: 0, y: 0 };
const picks = []; // recent picks log

const ATLAS_PATH = './src/assets/tile_sheet.png'; // works locally + GH Pages

function snap(n) { return Math.floor(n); }

function setupCanvas(p) {
  p.createCanvas(p.windowWidth, p.windowHeight);
  p.noSmooth();
  p.pixelDensity(1);
}

function drawGrid(p) {
  const startCol = Math.max(0, Math.floor(camX / TILE_SIZE));
  const startRow = Math.max(0, Math.floor(camY / TILE_SIZE));
  const endCol = startCol + Math.ceil(p.width  / TILE_SIZE) + 1;
  const endRow = startRow + Math.ceil(p.height / TILE_SIZE) + 1;

  p.stroke(0, 0, 0, 35);
  p.strokeWeight(1);

  for (let c = startCol; c <= endCol; c++) {
    const x = snap(c * TILE_SIZE - camX);
    p.line(x, 0, x, p.height);
  }
  for (let r = startRow; r <= endRow; r++) {
    const y = snap(r * TILE_SIZE - camY);
    p.line(0, y, p.width, y);
  }
}

function hoveredCR(p) {
  const col = Math.floor((p.mouseX + camX) / TILE_SIZE);
  const row = Math.floor((p.mouseY + camY) / TILE_SIZE);
  if (col < 0 || row < 0) return null;
  return { col, row };
}

function drawHover(p, cr) {
  if (!cr) return;
  const x = snap(cr.col * TILE_SIZE - camX);
  const y = snap(cr.row * TILE_SIZE - camY);

  // highlight cell
  p.noFill();
  p.stroke(255, 255, 0, 180);
  p.rect(x + 0.5, y + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);

  // blit exact tile (preview)
  const tileId = idOf(cr.col, cr.row);
  const { col, row } = fromId(tileId);
  if(p.mouseX < atlas.width && p.mouseX > 0 && p.mouseY < atlas.height && p.mouseY > 0) {
p.image(
    atlas,
    x, y, TILE_SIZE, TILE_SIZE,
    col * TILE_SIZE, row * TILE_SIZE,
    TILE_SIZE, TILE_SIZE
  );
  }
  

  // info panel (top-left)
  const label = `Tile → id:${tileId}  col:${cr.col}  row:${cr.row}`;
  p.noStroke();
  p.fill(0, 150);
  p.rect(8, 8, p.textWidth(label) + 16, 24, 6);
  p.fill(255);
  p.textAlign(p.LEFT, p.CENTER);
  p.text(label, 16, 20);
}

function logPick(p, cr) {
  const tileId = idOf(cr.col, cr.row);
  const msg = `Tile → id:${tileId}  col:${cr.col}  row:${cr.row}`;
  console.log(msg);
  picks.unshift(msg);
  if (picks.length > 12) picks.pop();

  // copy to clipboard if available
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(msg).catch(() => {});
  }
}

function drawLog(p) {
  if (picks.length === 0) return;
  const pad = 10, lh = 18;
  const w = Math.min(520, Math.max(...picks.map(s => p.textWidth(s) + 20)));
  const h = lh * picks.length + pad * 2;

  p.noStroke();
  p.fill(0, 140);
  p.rect(p.width - w - 16, 16, w, h, 8);

  p.fill(255);
  p.textAlign(p.LEFT, p.TOP);
  for (let i = 0; i < picks.length; i++) {
    p.text(picks[i], p.width - w - 16 + pad, 16 + pad + i * lh);
  }
}

// --- p5 wiring (instance mode) ----------------------------------------
function preload(p) {
  atlas = p.loadImage(ATLAS_PATH);
}

function setup(p) {
  setupCanvas(p);
  p.textFont('monospace', 12);
}

function draw(p) {
  p.background(40);

  if (atlas) {
    // draw the full atlas at current cam (so you can pan over it)
    p.image(atlas, -camX, -camY);
  }

  drawGrid(p);

  const cr = hoveredCR(p);
  drawHover(p, cr);
  drawLog(p);
}

function mousePressed(p) {
  // start panning with middle or right button, or hold space + left
  const pan = p.mouseButton === p.CENTER || p.mouseButton === p.RIGHT || p.keyIsDown(32);
  if (pan) {
    dragging = true;
    dragStart.x = p.mouseX; dragStart.y = p.mouseY;
    camStart.x = camX; camStart.y = camY;
  }
}

function mouseDragged(p) {
  if (!dragging) return;
  camX = camStart.x + (dragStart.x - p.mouseX);
  camY = camStart.y + (dragStart.y - p.mouseY);
  camX = Math.max(0, camX);
  camY = Math.max(0, camY);
}

function mouseReleased(p) {
  if (dragging) { dragging = false; return; }
  // left-click: record pick
  if (p.mouseButton === p.LEFT) {
    const cr = hoveredCR(p);
    if (cr) logPick(p, cr);
  }
}

function keyPressed(p) {
  // arrows to nudge camera
  const step = 40;
  if (p.keyCode === p.LEFT_ARROW)  camX = Math.max(0, camX - step);
  if (p.keyCode === p.RIGHT_ARROW) camX += step;
  if (p.keyCode === p.UP_ARROW)    camY = Math.max(0, camY - step);
  if (p.keyCode === p.DOWN_ARROW)  camY += step;

  // home = reset camera
  if (p.key.toLowerCase() === 'h') { camX = 0; camY = 0; }

  // c = copy last pick again
  if (p.key.toLowerCase() === 'c' && picks[0] && navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(picks[0]).catch(() => {});
  }

  // g = toggle grid (optional: comment out if you always want grid)
  // You could wire a flag here if you want.
}

// mount
new window.p5(p => {
  p.preload       = () => preload(p);
  p.setup         = () => setup(p);
  p.draw          = () => draw(p);
  p.mousePressed  = () => mousePressed(p);
  p.mouseDragged  = () => mouseDragged(p);
  p.mouseReleased = () => mouseReleased(p);
  p.keyPressed    = () => keyPressed(p);
});
