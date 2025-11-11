# Seif Platformer (Prototype)

A modular 2D engine built in JavaScript (p5.js) with a full in-engine level editor, runtime, and export system.

## 🧱 Currently Working On
Runtime-integrated **level builder** — a visual editor to create, export, and import `.json` maps directly inside the engine.  
The builder supports multi-layer editing (ground, detail, decoration), scrolling tile palette, and instant game-mode switching (`B` ↔ `G`).

![Builder Demo](./docs/builder-demo.gif)

---

## 🌐 Live Demo
👉 [https://seifpetit.github.io/seif-platformer]  
![Gameplay Demo](./docs/game-demo.gif)

A modular 2D platformer built with **p5.js**, featuring player physics, level rendering, and an integrated builder mode for in-engine editing.

🧩 **Current state:** working runtime + builder — levels load from JSON, tileset rendering functional, editor supports live painting.  
🎯 **Goal:** refine camera, add UI overlay for tools, and implement import/export workflow improvements.

---

## 🎮 What it does
- Tile-based level rendering from JSON maps  
- Player movement with gravity and velocity  
- Runtime mode switching (*Game* ↔ *Builder*)  
- Builder mode for map creation, export, and import  
- Multi-layer support (ground, detail, decoration)  
- Camera following and culling  
- Atlas-based tile rendering  

---

## 🛠️ Tech Stack
- **Language:** JavaScript (p5.js library)
- **Data:** JSON level definitions  
- **Tools:** VSCode, GitHub Pages  
- **Assets:** Custom tile atlas (`tile_sheet.png`)

---

## 📂 Folder Structure

<details> <summary><b>📂 src/</b> — click to expand ▼</summary>

  <details> <summary>~~🗂️assets/</summary> 

      → tile_sheet.png / player.png, slice_tiles.py, slices folder

  </details>
  <details> <summary>~~🧩core/</summary> 

      → runtime, renderer, camera (engine backbone)

  </details>
  <details> <summary>~~🛠 editor/</summary> 

      → in-engine level editor
  <details> <summary>~~~~🧮 grid/</summary> 

      → grid rendering, snapping, and overlays

  </details>
  <details> <summary>~~~~🧾 hud/</summary> 

      → bottom bar UI + tool info

  </details>
  <details> <summary>~~~~🎨 palette/</summary> 

      → tilesheet & selection logic

  </details>
  <details> <summary>~~~~✏️ tools/</summary> 

      → painting, erasing, and selection brushes

  </details>
  </details>
  
     
<details> <summary>~~🧍 entities/</summary>

      → player, coins, triggers (runtime objects)

</details>
<details> <summary>~~🎬 modes/</summary>

      → editor.js / game.js / future cinema.js

</details>
<details> <summary>~~🖼️ assets/</summary>

      → spritesheets, tilesets, and visual assets

</details>
<details> <summary>~~🧰 libraries/</summary>

      → helper libraries (shared logic)

</details>
</details>

<details> <summary><b>📂 levels/</b></summary>

    → JSON-based levels

</details>
<details> <summary><b>📂 docs/</b></summary>

    → demo GIFs, tileset docs, architecture notes

</details>
                   
  <summary><b>🌀 index.html</b>→ entry point (launches both editor & runtime)</summary>

---

## 🔗 Module Communication Protocol

  - `main.js` bootstraps the app → owns the p5 lifecycle (setup/draw).

  - `runtime.js` acts as the global state and orchestrator (shared `R` object).

  - `core/renderer.js` handles all layer compositing and tile rendering.

  - `modes/*` switch active logic (`editor.js` ↔ `game.js`) using `R.mode`.

  - `editor/*` modules (grid, hud, tools) plug into runtime via `R.builder`.

---

## 🚀 Roadmap

**v0.7 – Core Interaction**
- [x] JSON import/export system
- [x] HUD & hotkey help overlay
- [ ] Smooth camera panning and zoom
- [ ] Multiple brush modes (paint / erase / collision)

**v0.8 – Physics & Feel**
- [ ] Player physics integration
- [ ] Layer-based collision system
- [ ] Parallax and dynamic backgrounds

**v0.9 – Polish & Release**
- [ ] Refactor player collisions for multiple surfaces
- [ ] Add UI feedback for tool selection
- [ ] Performance pass + documentation polish


---

## 👨‍💻 Author
**Seif Jlassi**  
📍 Computer Science Student @ TU Dortmund  
💡 Exploring how logic and data structures translate into gameplay design and interactive systems.

---