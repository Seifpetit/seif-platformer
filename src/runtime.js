// runtime.js
// Central conductor: state, mode, render pipeline (layers + parallax), and HUD link.

// ----- Imports -----
import { TILE_SIZE, fromId } from "./tileset.js";

// ----- Runtime state -----
export const R = {
  mode: "game",                  // "game" | "builder"
  cam: { x: 0, y: 0 },
  level: null,                   // { width, height, layers: {ground, detail, decoration, collision, ...} }
  entities: [],                  // e.g., [player]
  atlas: null,                   // spritesheet image (p5.Image)

  builder: {
    padX: 12,     // optional HUD/canvas padding if you need it later
    level: null,  // builder’s working level gets assigned in main.js setup()
  },

  RESET_FRAMES: 0,

  hud: {
    ghlink: null,                  // <a> element (p5 DOM)
    info: {
      layerName: "ground",
      selectedId: 0,
      mapName: "",
      sizeText: "",              // e.g., "64×32"
    },

    dim : {
        w: 0,
        h: 40,
    }
  },

  // Layer registry (add/remove layers with one row)
  layers: [
    { name: "background", kind: "tile",     parallax: 0.3, order: 10 },
    { name: "ground",     kind: "tile",     parallax: 1.0, order: 20, collision: true },
    { name: "detail",     kind: "tile",     parallax: 1.0, order: 30 },
    { name: "decoration", kind: "tile",     parallax: 0.7, order: 40 },
    { name: "entities",   kind: "entities", parallax: 1.0, order: 50 },
    { name: "hud",        kind: "hud",      parallax: 0.0, order: 90 },
  ],
};

// ----- Setup / teardown -----

// Call once after canvas exists (typically from setup in main.js)
export function initRuntime(p) {
  // Create HUD link once
  if (!R.hud.link) {
    const url = "https://github.com/Seifpetit/seif-platformer";
    R.hud.link = p.createA(url, "GitHub ↗", "_blank");
    // Style to match bottom bar
    R.hud.link.style("font-size", "14px");
    R.hud.link.style("font-family", "monospace");
    R.hud.link.style("color", "#00baff");
    R.hud.link.style("text-decoration", "none");
    R.hud.link.style("background", "rgba(0,0,0,0.35)");
    R.hud.link.style("padding", "4px 8px");
    R.hud.link.style("border-radius", "6px");
    R.hud.link.hide(); // shown only in builder mode
  }
}

// Optional cleanup if you ever recreate sketches
export function destroyRuntime() {
  if (R.hud.link) {
    R.hud.link.remove();
    R.hud.link = null;
  }
  R.entities.length = 0;
  R.level = null;
  R.atlas = null;
}

// Provide the atlas image once it’s loaded (from preload/setup)
export function setAtlas(img) {
  R.atlas = img;
}

// Set/replace current level (expects dense arrays per layer)
export function setLevel(levelObj) {
  R.level = levelObj;
  // Update HUD size
  if (levelObj) {
    R.hud.info.sizeText = `${levelObj.width}×${levelObj.height}`;
  } else {
    R.hud.info.sizeText = "";
  }
}

// External scenes can switch mode via this
export function setMode(mode) {
  R.mode = mode;
  if (R.hud.link) {
    if (mode === "builder") R.hud.link.show();
    else R.hud.link.hide();
  }
}

// ----- Camera helpers -----
export function setCam(x, y) {
  R.cam.x = x | 0;
  R.cam.y = y | 0;
}

export function nudgeCam(dx, dy) {
  R.cam.x += dx;
  R.cam.y += dy;
}

// ----- Render pipeline -----

export function renderFrame(p) {
  const camX = R.cam.x, camY = R.cam.y;
  if (!R.level) return;

  // Sort passes by order (cheap, tiny list)
  const passes = [...R.layers].sort((a, b) => a.order - b.order);

  for (const L of passes) {
    const offX = camX * L.parallax;
    const offY = camY * L.parallax;

    if (L.kind === "tile") {
      const layerData = R.level.layers?.[L.name];
      if (layerData && R.atlas) {
        drawTileLayer(p, layerData, R.level.width, R.level.height, offX, offY, R.atlas);
      }
    }
    else if (L.kind === "entities") {
      drawEntities(p, R.entities, offX, offY);
    }
    else if (L.kind === "hud") {
      drawHUD(p, R.hud.info);
      positionHudLink(p); // keep the DOM link hugged to bottom-right
    }
  }
}

// ----- Drawers -----

function drawTileLayer(p, layerArray, W, H, offX, offY, atlasImage) {
  // Parallax-aware culling window
  const left   = Math.floor(offX / TILE_SIZE);
  const top    = Math.floor(offY / TILE_SIZE);
  const colsOn = Math.ceil(p.width  / TILE_SIZE) + 2;
  const rowsOn = Math.ceil(p.height / TILE_SIZE) + 2;

  for (let gy = top; gy < top + rowsOn; gy++) {
    if (gy < 0 || gy >= H) continue;
    for (let gx = left; gx < left + colsOn; gx++) {
      if (gx < 0 || gx >= W) continue;

      const idx = gy * W + gx;
      const id = layerArray[idx] | 0;
      if (!id) continue;

      const { col, row } = fromId(id);
      const sx = col * TILE_SIZE;
      const sy = row * TILE_SIZE;
      const dx = gx * TILE_SIZE - offX;
      const dy = gy * TILE_SIZE - offY;

      p.image(atlasImage, dx, dy, TILE_SIZE, TILE_SIZE, sx, sy, TILE_SIZE, TILE_SIZE);
    }
  }
}

function drawEntities(p, entities, offX, offY) {
  for (const e of entities) {
    if (e && typeof e.draw === "function") {
      e.draw(p, offX, offY);
    }
  }
}

function drawHUD(p, info) {
  // Bottom bar background
  p.noStroke();
  p.fill(0, 0, 0, 120);
  p.rect(0, p.height - 26, p.width, 26);

  // Left status text
  p.fill(255);
  p.textSize(14);
  p.textAlign(p.LEFT, p.CENTER);
  const leftText =
    `Mode: ${R.mode} | Layer: ${info.layerName} | Selected: ${info.selectedId}` +
    (info.sizeText ? ` | ${info.sizeText}` : "") +
    (info.mapName ? ` | ${info.mapName}` : "");
  p.text(leftText, 10, p.height - 13);
}

function positionHudLink(p) {
  if (!R.hud.link) return;
  const w = R.hud.link.elt.offsetWidth || 0;
  const x = p.width - w - 16;
  const y = p.height - 26 + ((26 - 18) / 2); // vertically centered-ish in bar (18px text)
  R.hud.link.position(x, y);
}

// ----- Convenience toggles (optional) -----

export function toggleLayerVisible(name, on) {
  // If you later add a 'visible' flag per layer, handle it here.
  // Kept for future debug overlays (e.g., collision).
}

export function getCollisionLayer() {
  return R.level?.layers?.collision || null;
}
