import { ModalWindow } from "./ModalWindow.js";

export class PopupUIClass {
  constructor() {
    this.modal = null;
    this.dragHint = null;
  }

  show(opts) {
    this.modal = new ModalWindow(opts);
    this.dragHint = null; // clear hint if real modal appears
  }

  close() {
    if (this.modal) this.modal.onClose();
    this.modal = null;
  }

  update(dt) {
    if (this.modal) {
      this.modal.update(dt);
      if (this.modal.shouldClose) this.modal = null;
    }
  }

  render(g) {
    // Render drag-hint
    if (!this.modal && this.dragHint) {
      g.push();
      g.fill(255, 255, 0, 60);
      g.textAlign(g.CENTER, g.CENTER);
      g.text("Drop files to import…", g.width / 2, g.height / 2);
      g.pop();
    }

    // Render modal on top
    if (this.modal) {
      this.modal.render(g);
    }
  }

  onClick(mx, my) {
    if (this.modal) {
      this.modal.checkClick(mx, my);
    }
  }


  isBlocking() {
    return !!this.modal;
  }

  startDragHint() {
    if (!this.modal) {
      this.dragHint = true;
    }
  }

  stopDragHint() {
    this.dragHint = null;
  }
}

export const PopupUI = new PopupUIClass();
