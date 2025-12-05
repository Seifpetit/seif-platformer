import { R } from "../../../core/runtime.js";

export class AudioAssetsPage {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0; 

    this.rowHeight = 32;
    this.hoveredId = null;
    this.isDragOver = false;

  }

  setGeometry(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  update() {

    const m = R.input.mouse;
    const assets = R.data.audio.assets || [];

    this.hoveredId = null;
    const dragging = !!R.ui.dragActive;   // we will set this soon

    const insidePanel =
      m.x >= this.x &&
      m.x <= this.x + this.w &&
      m.y >= this.y &&
      m.y <= this.y + this.h;

    R.cursor.inAudio = insidePanel;

    this.isDragOver = dragging && insidePanel;


    assets.forEach((asset, i) => {
      //-----------------------||----------------
      //-----------------------|| this is for the first header row
      //-----------------------\/----------------
      const rowY = this.y + this.rowHeight + i * this.rowHeight;
      const inside = 
            m.x >= this.x &&
            m.x <= this.x + this.w &&
            m.y >= rowY &&
            m.y <= rowY + this.rowHeight;
      
      if(inside) {
        this.hoveredId = asset.id;

        //SELECT ON CLICK
        if(m.pressed && m.button === "left") {
          R.ui.audio.selectedAssetId = asset.id;
        }
      }
    });

  }

  renderHeader(g) {
    if(!g) return;

    g.push();
    g.fill(40);
    g.rect(this.x, this.y, this.w, this.rowHeight);
    g.fill(200);
    g.textAlign(g.LEFT, g.CENTER); g.textSize(13);
    g.text("Assets (List View)", this.x + 0, this.y + this.rowHeight / 2);

  }

  renderFileRows(g) {
    if(!g) return;


    const assets = R.data.audio.assets || [];
    const startY = this.y + this.rowHeight;

    assets.forEach((asset, i) => {
      const rowY = startY + i * this.rowHeight;
      if (rowY >= this.y + this.h) return;
      const hovered = this.hoveredId === asset.id;
      const selected = this.selectedId === asset.id;

      let bg = 28;
      if (hovered) bg = 40;
      if (selected) bg = 70;

      g.fill(bg);
      g.rect(this.x, rowY, this.w, this.rowHeight);

      g.fill(220);
      g.textAlign(g.LEFT, g.CENTER); g.textSize(12);

      const label = asset.name || `asset_${asset.id}`;

      g.text(label, this.x + 10, rowY + this.rowHeight / 2);

      g.textAlign(g.RIGHT, g.CENTER);
      if(asset.duration != null) {
        g.text(`${asset.duration.toFixed(2)}s`, this.x + this.w - 10, rowY + this.rowHeight / 2);   
      }

    });

        // Dragging highlight
    if (this.isDragOver) this.dragHighlight(g);

    g.pop();
  }

  render(g) {
    if(!g) return;

    g.push(); g.fill(20);
    g.rect(this.x, this.y, this.w, this.h, 10, 10, 10, 10);

    //------HEADER------
    this.renderHeader(g);

    //------ROWS--------

    this.renderFileRows(g);
    
  }

  dragHighlight(g) {
    g.push();

        // semi-transparent overlay
        g.fill(255, 255, 0, 30);
        g.rect(this.x, this.y, this.w, this.h);

        // glowing border
        g.noFill();
        g.stroke("#00c8ff");
        g.strokeWeight(3);
        g.rect(this.x + 2, this.y + 2, this.w - 4, this.h - 4);

        // text
        g.noStroke();
        g.fill("#00c8ff");
        g.textAlign(g.CENTER, g.CENTER);
        g.textSize(18);
        g.text("Drop audio files to import", this.x + this.w / 2, this.y + this.h / 2);

        g.pop();
  }


}


