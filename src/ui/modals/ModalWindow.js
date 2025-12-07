export class ModalWindow {
  constructor({ text, status = "info", autoCloseMs = null }) {
    this.text = text;
    this.status = status;
    this.autoCloseMs = autoCloseMs;

    this.age = 0;
    this.shouldClose = false;
  }

  update(dt) {
    this.age += dt;

    if (this.autoCloseMs && this.age >= this.autoCloseMs) {
      this.shouldClose = true;
    }
  }

  render(g) {
    const w = 260;
    const h = 120;
    const x = (g.width - w) / 2;
    const y = (g.height - h) / 2;

    this.closeBtn = {
      x: x + w - 26,
      y: y + 6,
      w: 20,
      h: 20
    };


    g.push();
    g.fill(20, 20, 20, 230);
    g.rect(x, y, w, h, 12);

    g.fill(255);
    g.textAlign(g.CENTER, g.CENTER);
    g.textSize(14);
    g.text(this.text, x + w / 2, y + h / 2);

        // close button
    g.fill("#ff4d4d");
    g.rect(this.closeBtn.x, this.closeBtn.y, this.closeBtn.w, this.closeBtn.h, 4);

    g.fill(255);
    g.textAlign(g.CENTER, g.CENTER);
    g.text("X", this.closeBtn.x + 10, this.closeBtn.y + 10);


    g.pop();
  }

  checkClick(mx, my) {
    if (!this.closeBtn) return;

    if (
      mx >= this.closeBtn.x && mx <= this.closeBtn.x + this.closeBtn.w &&
      my >= this.closeBtn.y && my <= this.closeBtn.y + this.closeBtn.h
    ) {
      this.shouldClose = true;
    }
  }

  // Needed to prevent errors
  onClose() {
    this.shouldClose = true;
  }
}
