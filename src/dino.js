// ─────────────────────────────────────────────────────────────────────────────
// [ENTITY] Dino (player) — movement, gravity, draw
// - update(p): physics integration & controls
// - draw(p, camX, camY): render relative to camera
// - later: collisions will be injected via level's collision layer
// ─────────────────────────────────────────────────────────────────────────────

  export class Dino {

    // ─────────────────────────────────────────────────────────────────────────────
    // [STATE] position (x,y in pixels), velocity, grounded flag, sprite frame
    // ─────────────────────────────────────────────────────────────────────────────

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

    // ─────────────────────────────────────────────────────────────────────────────
    // [TICK] Apply gravity, handle input (left/right/jump), integrate velocity
    // TODO: plug in collision against level.layers.collision
    // ─────────────────────────────────────────────────────────────────────────────

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
    
    // ─────────────────────────────────────────────────────────────────────────────
    // [DRAW] Render the dino sprite in world space offset by camera
    // ─────────────────────────────────────────────────────────────────────────────

    draw(p, camX = 0, camY = 0) {
      const dx = this.x - camX;
      const dy = this.y - camY;
      p.noFill(); p.stroke(0);
      p.rect(dx, dy, this.w, this.w);
    }
  }
