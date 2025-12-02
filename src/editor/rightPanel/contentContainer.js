import { R } from "../../core/runtime.js";
import { Palette } from "./pages/palette.js";

export class ContentContainer {

  constructor() {
    this.x = this.y = this.w = this.h = 0;

    this.pages = {
      PALETTE: new Palette(),
    };
  }

  setGeometry(x, y, w, h) {
    this.x = x; this.y = y; this.w = w; this.h = h;
  }

  update() {

    if (R.ui.selectedBook === "TILES") {
      this.pages.PALETTE.setGeometry(this.x, this.y, this.w, this.h);

      let atlas = null;
      switch (R.ui.selectedPage) {
        case "WORLD_TILESET": atlas = R.atlas.world_tileset; break;
        case "COIN":          atlas = R.atlas.coin; break;
        case "FRUITS":        atlas = R.atlas.fruits; break;
      }

      this.pages.PALETTE.update(atlas);
    }
  }

  render(g) {
    g.push();
    g.fill(25);
    g.rect(this.x, this.y, this.w, this.h);

    if (R.ui.selectedBook === "TILES")
      this.pages.PALETTE.render(g);

    g.pop();
  }
}
