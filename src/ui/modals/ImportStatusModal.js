// /src/ui/modals/ImportStatusModal.js
import { ModalWindow } from "./ModalWindow.js";

export class ImportStatusModal extends ModalWindow {
  constructor({ filename, status, message, onClose }) {
    super({
      title: "Import Status",
      message,
      status,
      closable: status !== "loading"
    });

    this.filename = filename;
    this.onClose = onClose || null;
  }

  render(g) {
    super.render(g);

    // Additional info for imports
    g.push();
    g.fill(180);
    g.textSize(12);
    g.text(`File: ${this.filename}`, this.x + 20, this.y + this.h - 40);
    g.pop();
  }
}
