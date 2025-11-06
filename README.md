# Seif Platformer (Prototype)

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

## 🧩 File Structure
| File | Purpose |
|------|----------|
| `boot.js` | Launches runtime mode (Game or Builder) |
| `main.js` | Central draw loop and mode dispatcher |
| `builder.js` | Handles visual map editing & palette logic |
| `levelLoader.js` | Loads sparse JSON into dense layer buffers |
| `tileset.js` | Tile atlas registry and drawing helpers |
| `dino.js` | Player entity (movement, gravity, physics) |

---

## 🚧 Roadmap
- [ ] Add HUD / text overlay for tool selection  
- [ ] Expand builder export/import options  
- [ ] Improve camera smoothness and layer handling  
- [ ] Add parallax backgrounds and interactive tiles  
- [ ] Refactor player collisions for multiple surfaces  

---

## 👨‍💻 Author
**Seif Jlassi**  
📍 Computer Science Student @ TU Dortmund  
💡 Exploring how logic and data structures translate into gameplay design and interactive systems.

---

<img width="1845" height="784" alt="Capture" src="https://github.com/user-attachments/assets/dbcddfdf-500c-4d52-8656-9b9ccdfab312" />
