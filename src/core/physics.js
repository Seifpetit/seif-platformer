//  src/core/physics.js
// ─────────────────────────────────────────────────────────────────────────────
// [Core] Physics engine module
// Simplified 2D Newtonian step for entities
// independent of gameplay: used by all movable objects
// ─────────────────────────────────────────────────────────────────────────────
import { R } from './runtime.js';
// ─────────────────────────────────────────────────────────────────────────────

const GRAVITY = 0.5;  // gravity acceleration per frame
const FRICTION = 0.9; // friction coefficient for horizontal movement

// Apply physics to an entity
export function applyPhysics(entity, dt = 1) {

  if(!entity.physics) return;

  const p = entity.physics;

  p.vel.y += GRAVITY * dt; // apply gravity
  
  entity.x += p.vel.x * dt;
  entity.y += p.vel.y * dt;

  const levelHeight = R.builder.level.height * R.core.TILE_SIZE;
  const levelWidth = R.builder.level.width * R.core.TILE_SIZE;

  if ( entity.y > levelHeight - entity.height ) {
    entity.y = levelHeight - entity.height;
    p.vel.y = 0;
    p.grounded = true;
  } else {
    p.grounded = false;
  }

  if ( p.grounded ) p.vel.x *= FRICTION;
}

export function updatePhysicsAll(dt = 1) {
  
  if (!R.entities) return;
  for (const entity of R.entities) {
    applyPhysics(entity, dt);
  }

}