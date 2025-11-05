// src/dino.js
export class Dino {
  constructor(x, y) {
    this.w = 40;
    this.x = x;
    this.y = y;
    this.g = 0.8;
    this.vx = 0;
    this.vy = 0;
    this.xForce = 1.3;
    this.yForce = 20;
    this.lifes = 3;
  }

  update(p) {
    // input
    if (p.keyIsDown(68)) { if (this.vx < 10) this.vx += this.xForce; }   // D
    if (p.keyIsDown(81)) { if (this.vx > -10) this.vx -= this.xForce; }  // Q

    // physics
    this.vy += this.g;
    this.y  += this.vy;

    this.x  += this.vx;
    if (this.vx < -1) this.vx += 0.7;
    else if (this.vx > 1) this.vx -= 0.7;
    else this.vx = 0;
  }

  jump() { if (this.vy === 0) this.vy -= this.yForce; }

  draw(p, camX = 0, camY = 0) {
    const dx = this.x - camX;
    const dy = this.y - camY;
    p.noFill(); p.stroke(0);
    p.rect(dx, dy, this.w, this.w);
  }
}
