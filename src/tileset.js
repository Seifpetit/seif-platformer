/* =========================
   TILESET SPEC (fill me)
   ========================= */

// tileset geometry (already set earlier)
const original_tileSize = 16;
const tilesetCols = 33;
const tilesetRows = 28;

// helper: 1-based atlas frame id from (col,row)
const id = (c, r) => r * tilesetCols + c + 1;

/* ---------- 1×1: Singles ---------- */
const SINGLE = {
  // Ground bricks (use 1 or multiple for variation)
  GROUND: [
    /* e.g. id(20,0), id(21,0) */
  ],

  // Spike / hazard tile
  SPIKE: [
    /* e.g. id(12,7) */
  ],

  // Question box (static) + variants
  QUESTION: [
    /* e.g. id(29,1), id(30,1), id(31,1) */
  ],

  // Coin as a 1×1 tile (if present on the sheet)
  COIN: [
    /* e.g. id(30,0) */
  ],

  // Plain filler blocks in other colors (stone/grey/blue)
  STONE: [
    /* e.g. id(8,0) */
  ],
  METAL: [
    /* e.g. id(10,0) */
  ],
};

/* ---------- 2×1: Horizontal Pairs ---------- */
const H2 = {
  // Cloud 2×1 (left/right)
  CLOUD: {
    w: 2, h: 1,
    parts: {
      L: /* id(cL, r) */,
      R: /* id(cR, r) */,
    }
  },

  // Pipe rim 2×1 (top left/right) – some sheets draw the rim as two tiles
  PIPE_RIM: {
    w: 2, h: 1,
    parts: {
      L: /* id(...) */,
      R: /* id(...) */,
    }
  },
};

/* ---------- 1×2: Vertical Pairs ---------- */
const V2 = {
  // Vertical pipe body 1×2 (top/bottom)
  PIPE_BODY: {
    w: 1, h: 2,
    parts: {
      TOP:    /* id(...) */,
      BOTTOM: /* id(...) */,
    }
  },

  // Pole / post segment (top/bottom)
  POLE: {
    w: 1, h: 2,
    parts: {
      TOP:    /* id(...) */,
      BOTTOM: /* id(...) */,
    }
  },
};

/* ---------- 2×2: Quads ---------- */
const Q2 = {
  // Small bush/hill 2×2
  BUSH_SMALL: {
    w: 2, h: 2,
    parts: {
      TL: /* id(...) */, TR: /* id(...) */,
      BL: /* id(...) */, BR: /* id(...) */,
    }
  },

  // Doorway 2×2 (if you pick a square door)
  DOOR_2x2: {
    w: 2, h: 2,
    parts: {
      TL: /* id(...) */, TR: /* id(...) */,
      BL: /* id(...) */, BR: /* id(...) */,
    }
  },
};

/* ---------- 3×2: Pipes / Medium Hills ---------- */
const R3x2 = {
  // Classic vertical pipe: 3 rows × 2 cols (TOP row = rim)
  PIPE_3x2: {
    w: 2, h: 3,
    parts: {
      // row 0 (top rim)
      TL: /* id(...) */, TR: /* id(...) */,
      // row 1 (body)
      ML: /* id(...) */, MR: /* id(...) */,
      // row 2 (base)
      BL: /* id(...) */, BR: /* id(...) */,
    }
  },

  // Medium hill 3×2
  HILL_MEDIUM: {
    w: 3, h: 2,
    parts: {
      // row 0 (top)
      T1: /* id(...) */, T2: /* id(...) */, T3: /* id(...) */,
      // row 1 (base)
      B1: /* id(...) */, B2: /* id(...) */, B3: /* id(...) */,
    }
  },
};

/* ---------- 3×3: Large Hills / Clouds ---------- */
const R3x3 = {
  HILL_LARGE: {
    w: 3, h: 3,
    parts: {
      // row 0
      T1: /* id(...) */, T2: /* id(...) */, T3: /* id(...) */,
      // row 1
      M1: /* id(...) */, M2: /* id(...) */, M3: /* id(...) */,
      // row 2
      B1: /* id(...) */, B2: /* id(...) */, B3: /* id(...) */,
    }
  },

  CLOUD_BIG: {
    w: 3, h: 2, // some are 3×2; adjust if yours is 3×3
    parts: {
      // row 0
      T1: /* id(...) */, T2: /* id(...) */, T3: /* id(...) */,
      // row 1
      B1: /* id(...) */, B2: /* id(...) */, B3: /* id(...) */,
    }
  },
};

/* ---------- Optional: 4×3+ Castle / Background ---------- */
const LARGE = {
  CASTLE_4x3: {
    w: 4, h: 3,
    parts: {
      // fill TL..TR..BL..BR by row
      T1: /* id(...) */, T2: /* id(...) */, T3: /* id(...) */, T4: /* id(...) */,
      M1: /* id(...) */, M2: /* id(...) */, M3: /* id(...) */, M4: /* id(...) */,
      B1: /* id(...) */, B2: /* id(...) */, B3: /* id(...) */, B4: /* id(...) */,
    }
  }
};
