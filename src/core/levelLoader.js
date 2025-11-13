
// ─────────────────────────────────────────────────────────────────────────────
// [LEVEL I/O] Load sparse JSON → dense layer buffers + draw with culling
// - loadLevel(url) parses { width,height, tiles:[{x,y,id,layer}] }
// - drawLayer() renders only visible window using cameraX/Y
// ─────────────────────────────────────────────────────────────────────────────


// ─────────────────────────────────────────────────────────────────────────────
// [LOAD] Convert sparse tiles into dense arrays per layer
// Known layers: ground, detail, collision, decoration
// Returns { width, height, layers:{...} } merged with original JSON
// ─────────────────────────────────────────────────────────────────────────────

  export async function loadLevel(url) {
    const res = await fetch(url);
    const data = await res.json();

    // dense 2D arrays by layer (width*height), prefilled with 0
    const makeLayer = () => new Array(data.width * data.height).fill(0);
    const layers = {
      ground: makeLayer(),
      detail: makeLayer(),
      collision: makeLayer(),
      decoration: makeLayer()
    };

    // place sparse tiles
    for (const t of data.tiles) {
      const arr = layers[t.layer];
      if (!arr) continue;
      arr[t.y * data.width + t.x] = t.id;
    }

    return { ...data, layers };
  }

