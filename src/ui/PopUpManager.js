// /src/ui/PopupManager.js
import { R } from "../../core/runtime.js";

/* ----------------------------------------------------
   POPUP OBJECT
---------------------------------------------------- */
class Popup {
  constructor({ text, status = "loading", autoCloseMs = null }) {
    this.text = text;
    this.status = status;
    this.autoCloseMs = autoCloseMs;

    this.createdAt = performance.now();
    this.closable = status === "error";

    // Geometry of close button (computed at render time)
    this.closeBox = null;
  }

  isExpired() {
    if (!this.autoCloseMs) return false;
    return performance.now() - this.createdAt >= this.autoCloseMs;
  }
}

/* ----------------------------------------------------
   HINT POPUP (FADE IN / OUT)
---------------------------------------------------- */
class HintPopup {
  constructor() {
    this.alpha = 0;        // 0 → 255
    this.targetAlpha = 0;  // fade target
    this.fadeSpeed = 0.15; // transition
    this.message = "You're dragging a file to import…";
  }

  show() {
    this.targetAlpha = 255;
  }

  hide() {
    this.targetAlpha = 0;
  }

  update() {
    this.alpha += (this.targetAlpha - this.alpha) * this.fadeSpeed;
    if (this.alpha < 1) this.alpha = 0;
  }

  render(g) {
    if (this.alpha <= 0) return;

    g.push();
    g.noStroke();
    g.fill(20, 20, 20, this.alpha);
    g.rect(20, g.height - 60, g.width - 40, 40, 6);

    g.fill(255, this.alpha);
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(14);
    g.text(this.message, g.width / 2, g.height - 40);

    g.pop();
  }
}

/* ----------------------------------------------------
   POPUP MANAGER (MAIN)
---------------------------------------------------- */
export class PopupManager {
  constructor() {
    this.active = null; // main modal popup
    this.hint = new HintPopup();
  }

  /* ---------------------- MODAL POPUP CONTROL ---------------------- */

  show(options) {
    this.active = new Popup(options);
    R.ui.modalLock = true;
  }

  close() {
    this.active = null;
    R.ui.modalLock = false;
  }

  /* ---------------------- DRAG HINT CONTROL ------------------------ */

  startDragHint() {
    this.hint.show();
  }

  stopDragHint() {
    this.hint.hide();
  }

  /* ---------------------- UPDATE ------------------------ */

  update() {
    // update hint fade state
    this.hint.update();

    // update modal popup expiry
    if (this.active?.isExpired()) {
      this.close();
    }
  }

  /* ---------------------- RENDER ------------------------ */

  render(g) {
    /* 1 — Render hint popup behind */
    this.hint.render(g);

    /* 2 — Render modal popup */
    if (!this.active) return;

    const p = this.active;

    const w = 320;
    const h = 140;
    const x = (g.width - w) / 2;
    const y = (g.height - h) / 2;

    g.push();

    // backdrop
    g.fill(0, 0, 0, 120);
    g.rect(0, 0, g.width, g.height);

    // popup box
    g.fill(30);
    g.rect(x, y, w, h, 10);

    // status light
    const color =
      p.status === "loading" ? "#ffaa00" : "#ff4444";
      p.status === "success" ? "#22ff99" : "#ff4444";

    g.fill(color);
    g.circle(x + w - 20, y + 20, 12);

    // text
    g.fill(240);
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(15);
    g.text(p.text, x + w / 2, y + h / 2);

    // close button (only for errors)
    if (p.closable) {
      const bx = x + w/2 - 40;
      const by = y + h - 28;
      const bw = 80;
      const bh = 20;

      p.closeBox = { x: bx, y: by, w: bw, h: bh };

      g.fill("#ff4444");
      g.rect(bx, by, bw, bh, 4);
      g.fill("white");
      g.textSize(12);
      g.text("CLOSE", bx + bw/2, by + bh/2);
    }

    g.pop();
  }

  /* ---------------------- INPUT ------------------------ */

  onClick(mx, my) {
    if (!this.active?.closable) return;

    const b = this.active.closeBox;
    if (!b) return;

    const inside =
      mx >= b.x && mx <= b.x + b.w &&
      my >= b.y && my <= b.y + b.h;

    if (inside) this.close();
  }
}

/* Singleton */
export const PopupUI = new PopupManager();
