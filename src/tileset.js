// src/tileset.js
// Registry aligned to tileset.md
// Cell size = 20px, atlas columns = 29 (0-based col/row).

export const TILE_SIZE = 20;
export const TILE_COLS = 29;

// id helpers
export const id = (col, row) => row * TILE_COLS + col + 1;
export const fromId = (tileId) => {
  const z = tileId - 1;
  return { col: z % TILE_COLS, row: Math.floor(z / TILE_COLS) };
};
export const srcRect = (tileId) => {
  const { col, row } = fromId(tileId);
  return { sx: col * TILE_SIZE, sy: row * TILE_SIZE, sw: TILE_SIZE, sh: TILE_SIZE };
};

const blit = (idVal, x, y) => {
  const { col, row } = fromId(idVal);
  const dx = Math.floor(px(x));
  const dy = Math.floor(py(y));
  p.image(
    atlas,
    dx, dy, TILE_SIZE, TILE_SIZE,
    col * TILE_SIZE, row * TILE_SIZE,
    TILE_SIZE, TILE_SIZE
  );
};

// draw helper (p5-style image)

// draw helper (already good)
export function drawTileId(p, img, tileId, gx, gy, destSize = TILE_SIZE) {
  const { sx, sy, sw, sh } = srcRect(tileId);
  const dx = Math.floor(gx * destSize);
  const dy = Math.floor(gy * destSize);
  p.image(img, dx, dy, destSize, destSize, sx, sy, sw, sh);
}

// ── convenience renderers ──────────────────────────────────────────────
export function drawPipe2x2(p, img, gx, gy, color = 'green', destSize = TILE_SIZE) {
  const ids = PIPE_2x2[color];
  drawTileId(p, img, ids[0], gx + 0, gy + 0, destSize);
  drawTileId(p, img, ids[1], gx + 1, gy + 0, destSize);
  drawTileId(p, img, ids[2], gx + 0, gy + 1, destSize);
  drawTileId(p, img, ids[3], gx + 1, gy + 1, destSize);
}

export function drawPipe3x2(p, img, gx, gy, color = 'green', destSize = TILE_SIZE) {
  const ids = PIPE_3x2[color];
  drawTileId(p, img, ids[0], gx + 0, gy + 0, destSize);
  drawTileId(p, img, ids[1], gx + 1, gy + 0, destSize);
  drawTileId(p, img, ids[2], gx + 2, gy + 0, destSize);
  drawTileId(p, img, ids[3], gx + 0, gy + 1, destSize);
  drawTileId(p, img, ids[4], gx + 1, gy + 1, destSize);
  drawTileId(p, img, ids[5], gx + 2, gy + 1, destSize);
}

export function drawPlatform1x3(p, img, gx, gy, variant = 'A', destSize = TILE_SIZE) {
  const ids = PLATFORM_1x3[variant] || PLATFORM_1x3.A;
  drawTileId(p, img, ids[0], gx + 0, gy, destSize);
  drawTileId(p, img, ids[1], gx + 1, gy, destSize);
  drawTileId(p, img, ids[2], gx + 2, gy, destSize);
}

export function drawCloudStrip1x3(p, img, gx, gy, rowKey = 'r20', destSize = TILE_SIZE) {
  const ids = CLOUD_STRIP_1x3[rowKey] || CLOUD_STRIP_1x3.r20;
  drawTileId(p, img, ids[0], gx + 0, gy, destSize);
  drawTileId(p, img, ids[1], gx + 1, gy, destSize);
  drawTileId(p, img, ids[2], gx + 2, gy, destSize);
}

export function drawCloud3x2(p, img, gx, gy, variant = 'A1', destSize = TILE_SIZE) {
  const [TL, TM, TR, BL, BM, BR] = CLOUD_3x2[variant] || CLOUD_3x2.A1;
  drawTileId(p, img, TL, gx + 0, gy + 0, destSize);
  drawTileId(p, img, TM, gx + 1, gy + 0, destSize);
  drawTileId(p, img, TR, gx + 2, gy + 0, destSize);
  drawTileId(p, img, BL, gx + 0, gy + 1, destSize);
  drawTileId(p, img, BM, gx + 1, gy + 1, destSize);
  drawTileId(p, img, BR, gx + 2, gy + 1, destSize);
}

export function drawWaterStrip(p, img, gx, gy, variant = 'A', width = 3, destSize = TILE_SIZE) {
  const [L, M, R] = WATER_1x3[variant] || WATER_1x3.A;
  drawTileId(p, img, L, gx + 0, gy, destSize);
  for (let i = 1; i < Math.max(1, width - 2); i++) drawTileId(p, img, M, gx + i, gy, destSize);
  drawTileId(p, img, R, gx + Math.max(2, width - 1), gy, destSize);
}

// stacks / trunks
export function drawStack2(p, img, gx, gy, ids, destSize = TILE_SIZE) {
  const [TOP, BOTTOM] = ids;
  drawTileId(p, img, TOP, gx, gy, destSize);
  drawTileId(p, img, BOTTOM, gx, gy + 1, destSize);
}

export function drawStack3(p, img, gx, gy, ids, destSize = TILE_SIZE) {
  const [TOP, MID, BOT] = ids;
  drawTileId(p, img, TOP, gx, gy + 0, destSize);
  drawTileId(p, img, MID, gx, gy + 1, destSize);
  drawTileId(p, img, BOT, gx, gy + 2, destSize);
}

export function drawTrunkBand(p, img, gx, gy, variant = 'R1', width = 3, destSize = TILE_SIZE) {
  const [L, M, R] = TRUNK_3x1[variant] || TRUNK_3x1.R1;
  drawTileId(p, img, L, gx + 0, gy, destSize);
  for (let i = 1; i < Math.max(1, width - 2); i++) drawTileId(p, img, M, gx + i, gy, destSize);
  drawTileId(p, img, R, gx + Math.max(2, width - 1), gy, destSize);
}

export function drawTrunkColumn(p, img, gx, gy, variant = 'R1', height = 3, destSize = TILE_SIZE) {
  const [L, M, R] = TRUNK_3x1[variant] || TRUNK_3x1.R1;
  for (let row = 0; row < height; row++) {
    drawTileId(p, img, L, gx + 0, gy + row, destSize);
    drawTileId(p, img, M, gx + 1, gy + row, destSize);
    drawTileId(p, img, R, gx + 2, gy + row, destSize);
  }
}

// --- TREE COMPOSER (guaranteed export) --------------------------------
export function drawTree(p, atlas, gx, gy, spec, { camX = 0, camY = 0 } = {}) {
  const { top, mid, trunk, width = 3, midRows = 1, trunkRows = 3 } = spec;

  // registries defined above
  const topIds   = (typeof top   === 'string') ? BUSH_TOP_1x3[top]   : top;
  const midIds   = (typeof mid   === 'string') ? CANOPY_MID_3x1[mid] : mid;
  const trunkIds = (typeof trunk === 'string') ? TRUNK_3x1[trunk]    : trunk;

  if (!topIds || !midIds || !trunkIds) {
    console.warn('drawTree: bad keys', { top, mid, trunk, topIds, midIds, trunkIds });
    return;
  }

  const px = (gx) => gx * TILE_SIZE - camX;
  const py = (gy) => gy * TILE_SIZE - camY;

  const blit = (idVal, x, y) => {
    const { col, row } = fromId(idVal);
    p.image(
      atlas,
      px(x), py(y), TILE_SIZE, TILE_SIZE,
      col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE
    );
  };

  const drawTripleRow = (ids, x, y, w) => {
    blit(ids[0], x, y);                         // left
    for (let i = 0; i < Math.max(0, w - 2); i++) blit(ids[1], x + 1 + i, y); // middle repeat
    blit(ids[2], x + Math.max(1, w - 1), y);    // right
  };

  let y = gy;
  drawTripleRow(topIds,   gx, y++, width);      // top band
  for (let r = 0; r < midRows;   r++) drawTripleRow(midIds,   gx, y++, width); // middle canopies
  for (let r = 0; r < trunkRows; r++) drawTripleRow(trunkIds, gx, y++, width); // trunk bands
}

// keep this named export to make tree import unambiguous
export { drawTree as __ensureDrawTreeExport__ };


/* -----------------------------
   ATOMIC (single-cell) tiles
------------------------------*/

/* -----------------------------
   💰 COINS & ❓QUESTION BOXES
   (tile_sheet.png • 20×20 • TILE_COLS=29)
------------------------------*/

// Coins = rows 0,2,4,6 (4 frames each: cols 23–26)
export const COIN_ANIM = {
  brown: [24, 25, 26, 27],      // row 0
  blue:  [82, 83, 84, 85],      // row 2
  green: [140, 141, 142, 143],  // row 4
  gray:  [198, 199, 200, 201],  // row 6
};
// default coin (use whichever palette you draw with)
export const COINS = COIN_ANIM.brown;

// Question boxes = rows 1,3,5,7 (3 frames each: cols 23–25)
export const QUESTION_BOX_ANIM = {
  brown: [53, 54, 55],   // row 1
  blue:  [111, 112, 113],// row 3
  green: [169, 170, 171],// row 5
  gray:  [227, 228, 229] // row 7
};
// default question box
export const QUESTION_BOX = QUESTION_BOX_ANIM.brown;

/* -----------------------------
   🎁 OTHER COLLECTIBLES
   (tile_sheet.png • 20×20 • TILE_COLS=29)
   Rows/cols per your MD table.
------------------------------*/

export const COLLECTIBLES = {
  r1:  [56, 57, 58],                 // c26–28, row 1
  r3:  [114, 115, 116],              // c26–28, row 3
  r5:  [172, 173, 174],              // c26–28, row 5
  r7:  [230, 231, 232],              // c26–28, row 7

  r8:  [258, 259, 260],              // c25–27, row 8
  r9:  [287, 288, 289],              // c25–27, row 9
  r10: [316, 317, 318, 319],         // c25–28, row 10
  r11: [345, 346, 347, 348],         // c25–28, row 11
  r12: [374, 375, 376],              // c25–27, row 12
  r13: [403, 404, 405],              // c25–27, row 13
  r14: [432, 433, 434, 435],         // c25–28, row 14
  r15: [461, 462, 463, 464],         // c25–28, row 15
  r16: [490, 491, 492],              // c25–27, row 16
  r17: [519, 520, 521],              // c25–27, row 17
  r18: [548, 549, 550, 551],         // c25–28, row 18
  r19: [577, 578, 579, 580],         // c25–28, row 19
  r20: [606, 607, 608],              // c25–27, row 20
  r21: [635, 636, 637],              // c25–27, row 21
  r22: [664, 665, 666, 667],         // c25–28, row 22
  r23: [693, 694, 695, 696],         // c25–28, row 23
};

// handy flattened list if you ever want to iterate over all
export const COLLECTIBLES_ALL = [
  ...COLLECTIBLES.r1,  ...COLLECTIBLES.r3,  ...COLLECTIBLES.r5,  ...COLLECTIBLES.r7,
  ...COLLECTIBLES.r8,  ...COLLECTIBLES.r9,  ...COLLECTIBLES.r10, ...COLLECTIBLES.r11,
  ...COLLECTIBLES.r12, ...COLLECTIBLES.r13, ...COLLECTIBLES.r14, ...COLLECTIBLES.r15,
  ...COLLECTIBLES.r16, ...COLLECTIBLES.r17, ...COLLECTIBLES.r18, ...COLLECTIBLES.r19,
  ...COLLECTIBLES.r20, ...COLLECTIBLES.r21, ...COLLECTIBLES.r22, ...COLLECTIBLES.r23,
];

/* -----------------------------
   👾 ENTITIES
   (tile_sheet.png • 16×16 logical size • TILE_COLS=29)
   For dynamic actors: enemies, NPCs, moving pickups, etc.
------------------------------*/

export const ENTITIES = {
  // column 16 set (row 0–6)
  c16: [17, 75, 133, 191],

  // column 17 (row 9–19)
  c17: [279, 337, 395, 453, 511, 569],

  // column 18 (row 1–18)
  c18: [48, 106, 164, 222, 251, 309, 367, 425, 483, 541],
};

// optional flattened list for iteration or collision tagging
export const ENTITIES_ALL = [
  ...ENTITIES.c16,
  ...ENTITIES.c17,
  ...ENTITIES.c18,
];

/* -----------------------------
   ☁️ CLOUDS — SINGLES (1×1)
   (tile_sheet.png • 20×20 • TILE_COLS=29)
------------------------------*/

export const CLOUD_SINGLE = [
  614, // col 4, row 21
  672, // col 4, row 23
  730  // col 4, row 25
];


/* -----------------------------
🧱 Ground
   GROUND BLOCKS
   (from tile_sheet.png • 20×20 • TILE_COLS=29)
------------------------------*/

export const GROUND = [
  // column 0-3 group (main soil set)
  1, 30, 59, 88, 117, 146, 175, 204,
  2, 31, 60, 89, 118, 147, 176, 205,
  3, 32, 61, 90, 119, 148, 177, 206,
  4, 62, 120, 178,

  // column 11 (alt soil / stone)
  12, 41, 70, 99, 128, 157, 186, 215,

  // column 13
  14, 72, 130, 188,

  // column 15-16
  16, 45, 74, 103, 132, 161, 190, 219,
  46, 104, 162, 220,

  // column 17-19 (dark / brickish)
  18, 76, 134, 192,
  19, 77, 135, 193,
  20, 49, 78, 107, 136, 165, 194, 223,

  // column 21 (moss / light soil)
  22, 80, 138, 196
];


/* -----------------------------
   COMPOSITES (multi-cell)
   order: left→right / top→bottom
------------------------------*/


// 🚰 Pipes 2×2 (vertical) — color variants (rows/bands as in MD)
/* -----------------------------
   🧱 2×2 PIPES (VERTICAL) — ALL COLORS
   (tile_sheet.png • 20×20 • TILE_COLS=29)
   Each array = [TL, TR, BL, BR]
------------------------------*/

export const PIPE_2x2 = {
  A: [233, 234, 262, 263], // rows 8–9
  B: [291, 292, 320, 321], // rows 10–11
  C: [349, 350, 378, 379], // rows 12–13
  D: [407, 408, 436, 437], // rows 14–15
  E: [465, 466, 494, 495], // rows 16–17
  F: [523, 524, 552, 553], // rows 18–19

  // color aliases (optional)
  green:  [233, 234, 262, 263],
  red:    [291, 292, 320, 321],
  blue:   [349, 350, 378, 379],
  yellow: [407, 408, 436, 437],
  gray:   [465, 466, 494, 495],
  purple: [523, 524, 552, 553],
};


/* -----------------------------
   🚰 3×2 PIPES (HORIZONTAL) — ALL COLORS
   (tile_sheet.png • 20×20 • TILE_COLS=29)
   Each array = [TL, TM, TR,  BL, BM, BR]
------------------------------*/

export const PIPE_3x2 = {
  A: [235, 236, 237, 264, 265, 266], // rows 8–9
  B: [293, 294, 295, 322, 323, 324], // rows 10–11
  C: [351, 352, 353, 380, 381, 382], // rows 12–13
  D: [409, 410, 411, 438, 439, 440], // rows 14–15
  E: [467, 468, 469, 496, 497, 498], // rows 16–17
  F: [525, 526, 527, 554, 555, 556], // rows 18–19

  // optional color aliases for easier calls
  green:  [235, 236, 237, 264, 265, 266],
  red:    [293, 294, 295, 322, 323, 324],
  blue:   [351, 352, 353, 380, 381, 382],
  yellow: [409, 410, 411, 438, 439, 440],
  gray:   [467, 468, 469, 496, 497, 498],
  purple: [525, 526, 527, 554, 555, 556],
};

/* -----------------------------
   🪵 PLATFORMS (1×3) — ALL COLORS
   (tile_sheet.png • 20×20 • TILE_COLS=29)
   Each array = [L, M, R] — middle repeats for longer platforms.
------------------------------*/

export const PLATFORM_1x3 = {
  A: [267, 268, 269], // row 9
  B: [325, 326, 327], // row 11
  C: [383, 384, 385], // row 13
  D: [441, 442, 443], // row 15
  E: [499, 500, 501], // row 17
  F: [557, 558, 559], // row 19

  // optional color aliases
  green:  [267, 268, 269],
  red:    [325, 326, 327],
  blue:   [383, 384, 385],
  yellow: [441, 442, 443],
  gray:   [499, 500, 501],
  purple: [557, 558, 559],
};


/* -----------------------------
   ☁️ CLOUDS — COMPOSITES
   1) Strips (1×3): [L, M, R]  — middle repeats
   2) Big clouds (3×2): [TL, TM, TR,  BL, BM, BR]
------------------------------*/

// 1) Strips (1×3)
// Rows shown in comments: 20, 22, 24, 26
export const CLOUD_STRIP_1x3 = {
  r20: [589, 590, 591],
  r22: [647, 648, 649],
  r24: [705, 706, 707],
  r26: [763, 764, 765],
};



// 2) Big clouds (3×2)
// Family A uses columns 0–2; Family B uses columns 5–7.
// Variants A1–A4 map to rows (20–21), (22–23), (24–25), (26–27) respectively.
export const CLOUD_3x2 = {
  // Family A (cols 0–2)
  A1: [581, 582, 583, 610, 611, 612], // rows 20 & 21
  A2: [639, 640, 641, 668, 669, 670], // rows 22 & 23
  A3: [697, 698, 699, 726, 727, 728], // rows 24 & 25
  A4: [755, 756, 757, 784, 785, 786], // rows 26 & 27

  // Family B (cols 5–7)
  B1: [586, 587, 588, 615, 616, 617], // rows 20 & 21
  B2: [644, 645, 646, 673, 674, 675], // rows 22 & 23
  B3: [702, 703, 704, 731, 732, 733], // rows 24 & 25
  B4: [760, 761, 762, 789, 790, 791], // rows 26 & 27
};



/* -----------------------------
   🌊 WATER / WAVES / BRIDGES (1×3)
   (tile_sheet.png • 20×20 • TILE_COLS=29)
   Each array = [L, M, R] — middle repeats to extend width.
------------------------------*/

export const WATER_1x3 = {
  A: [584, 585, 613], // rows 20–21: 584(c3,r20), 585(c4,r20), 613(c3,r21)
  B: [642, 643, 671], // rows 22–23
  C: [700, 701, 729], // rows 24–25
  D: [758, 759, 561], // rows 26 + bridge cap 561(c9,r19)
};


/* -----------------------------
   🌳 SMALL TREES (2×1 vertical)
   Each = [TOP, BOTTOM]
------------------------------*/
export const TREE_2x1 = {
  T1: [249, 278],
  T2: [307, 336],
  T3: [365, 394],
  T4: [423, 452],
  T5: [481, 510],
  T6: [539, 568],
};

/* -----------------------------
   🌿 BUSHES (2×1 vertical)
   Each = [TOP, BOTTOM]
------------------------------*/
export const BUSH_2x1 = {
  B1: [246, 278],
  B2: [304, 336],
  B3: [362, 394],
  B4: [420, 452],
  B5: [478, 510],
  B6: [536, 568],
};

/* -----------------------------
   🌲 MEDIUM TREES (3×1 vertical)
   Each = [TOP, MIDDLE, BOTTOM]
------------------------------*/
export const TREE_3x1 = {
  M1: [247, 276, 278],
  M2: [305, 334, 336],
  M3: [363, 392, 394],
  M4: [421, 450, 452],
  M5: [479, 508, 510],
  M6: [537, 566, 568],
};



/* -----------------------------
   🌿 BUSHES / CANOPIES (1×3 HORIZONTAL)
   Each array = [L, M, R] — middle repeats to extend width.
   Family A = cols 11–13, Family B = cols 19–21
------------------------------*/

// --- Tree Canopy: TOP bands (1x3) ------------------------------------
// From your “Bushes/Canopies (1×3 Horizontal)” section.
export const BUSH_TOP_1x3 = {
  // col 11–13
  A1: [ id(11,9),  id(12,9),  id(13,9)  ],  // 273–274–275
  A2: [ id(11,11), id(12,11), id(13,11) ],  // 331–332–333
  A3: [ id(11,13), id(12,13), id(13,13) ],  // 389–390–391
  A4: [ id(11,15), id(12,15), id(13,15) ],  // 447–448–449
  A5: [ id(11,17), id(12,17), id(13,17) ],  // 505–506–507
  A6: [ id(11,19), id(12,19), id(13,19) ],  // 563–564–565
  // col 19–21
  B1: [ id(19,9),  id(20,9),  id(21,9)  ],  // 281–282–283
  B2: [ id(19,11), id(20,11), id(21,11) ],  // 339–340–341
  B3: [ id(19,13), id(20,13), id(21,13) ],  // 397–398–399
  B4: [ id(19,15), id(20,15), id(21,15) ],  // 455–456–457
  B5: [ id(19,17), id(20,17), id(21,17) ],  // 513–514–515
  B6: [ id(19,19), id(20,19), id(21,19) ],  // 571–572–573
};

// --- Tree Canopy: MIDDLE bands (1x3) ---------------------------------
// From your “Tree — Middle Canopy (3×1 bands)” section.
export const CANOPY_MID_3x1 = {
  A1: [ id(5,8),  id(6,8),  id(7,8)  ],   // 238–239–240
  A2: [ id(5,10), id(6,10), id(7,10) ],   // 296–297–298
  A3: [ id(5,12), id(6,12), id(7,12) ],   // 354–355–356
  A4: [ id(5,14), id(6,14), id(7,14) ],   // 412–413–414
  A5: [ id(5,16), id(6,16), id(7,16) ],   // 470–471–472
  A6: [ id(5,18), id(6,18), id(7,18) ],   // 528–529–530
  B1: [ id(19,8), id(20,8), id(21,8) ],   // 252–253–254
  B2: [ id(19,10),id(20,10),id(21,10)],   // 310–311–312
  B3: [ id(19,12),id(20,12),id(21,12)],   // 368–369–370
  B4: [ id(19,14),id(20,14),id(21,14)],   // 426–427–428
  B5: [ id(19,16),id(20,16),id(21,16)],   // 484–485–486
  B6: [ id(19,18),id(20,18),id(21,18)],   // 542–543–544
};

// --- Trunk bands (1x3) by “row key” R# -------------------------------
// From your “Tree Trunks (3×1 base bands)” (Left 28 • Middle varies • Right 29).
export const TRUNK_3x1 = {
  R1:  [ id(27,0), id(5,1),   id(28,0) ], // 28 • 35 • 29
  R3:  [ id(27,0), id(5,3),   id(28,0) ], // 28 • 93 • 29
  R5:  [ id(27,0), id(5,5),   id(28,0) ], // 28 • 151 • 29
  R7:  [ id(27,0), id(5,7),   id(28,0) ], // 28 • 209 • 29
  R8:  [ id(27,0), id(18,8),  id(28,0) ], // 28 • 251 • 29
  R9:  [ id(27,0), id(18,9),  id(28,0) ], // 28 • 280 • 29
  R10: [ id(27,0), id(18,10), id(28,0) ], // 28 • 309 • 29
  R11: [ id(27,0), id(18,11), id(28,0) ], // 28 • 338 • 29
  R12: [ id(27,0), id(18,12), id(28,0) ], // 28 • 367 • 29
  R13: [ id(27,0), id(18,13), id(28,0) ], // 28 • 396 • 29
  // add more if you want later (425, 454, 483, 512, 541, 570…)
};


// 🎯 Cannons (vertical 1×3) — EXACT MD order (Top, Mid, Bottom)
export const CANNON_VERTICAL = {
  type1: [ 10, 39, 38 ],
  type2: [ 68, 97, 96 ],
  type3: [ 126, 155, 154 ],
  type4: [ 184, 213, 212 ],
};




