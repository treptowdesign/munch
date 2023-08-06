import { GLOBALS } from '../globals.js'

// Check Collision 
export function checkCollision(entityA, entityB, handlers, target){
  const distX = entityA.position.x - entityB.position.x;
  const distY = entityA.position.y - entityB.position.y;
  const distance = Math.sqrt(distX * distX + distY * distY);
  const isCollision = distance < entityA.size + entityB.size;
  if(isCollision && handlers){
    if(typeof handlers === 'function') {
      // single handler
      handlers(entityA, entityB, target);
    } else if(Array.isArray(handlers)) {
      // array of handlers
      for(let i = 0; i < handlers.length; i++) {
        handlers[i](entityA, entityB, target);
      }
    }
  } 
  return isCollision;
  }
  
// Reflect/Bounce
export function reflect(entityA, entityB){
    // set collide 
    entityA.isColliding = 5;
    entityB.isColliding = 5;
    // Run Collide Handler 
    const distX = entityA.position.x - entityB.position.x;
    const distY = entityA.position.y - entityB.position.y;
    const distance = Math.sqrt(distX * distX + distY * distY);
    // Calculate normal vector
    const nx = distX / distance;
    const ny = distY / distance;
    // Calculate relative velocity
    const vx = entityA.speed.x - entityB.speed.x;
    const vy = entityA.speed.y - entityB.speed.y;
    // Calculate relative velocity in terms of the normal direction
    const speedOnNormal = vx * nx + vy * ny;
    // Perform collision response if moving towards each other
    if (speedOnNormal < 0) {
      // account for size 
      const impulse = 2 * speedOnNormal / ((1/entityA.size) + (1/entityB.size));
      // Change velocities based on impulse
      entityA.speed.x -= impulse * nx / entityA.size;
      entityA.speed.y -= impulse * ny / entityA.size;
      entityB.speed.x += impulse * nx / entityB.size;
      entityB.speed.y += impulse * ny / entityB.size;
    }
  }

// Log Collide 
export function logCollision(){
    console.log('Collide Logged!');
}

// Shrink Player
export function shrinkPlayer(entity, player){
    let scaleFactor = entity.size / (GLOBALS.game.maxSize - GLOBALS.game.minSize); 
    player.size = Math.max(player.size - scaleFactor, GLOBALS.game.minSize);
}

// Eat Bacteria 
export function eatBacteria(bacteria, entity){
    if (bacteria.active) {
      entity.size = Math.min(GLOBALS.game.maxSize, entity.size + bacteria.bonus);
      bacteria.active = false;
    }  
  }

// Player Spike Attack 
export function spikeAttack(entity, spike, player){
  // args: entity (slime), the spike, and the player as a target...
  if(!spike.atkThrottled){
    // console.log('HIT!!!!!'); 
    entity.size -= 1;
    player.size += 1;
    spike.atkThrottled = true;
  } else {
    // console.log('...attack throttled'); 
  }
}

// Hunter Slime Homing 
export function hunterSeek(aura, player, target){
  let dx = player.position.x - aura.position.x;
  let dy = player.position.y - aura.position.y;
  let distance = Math.sqrt(dx*dx + dy*dy);
  let direction = {x: dx/distance, y: dy/distance};
  // speed factor of direction
  let speedFactor = 0.05; 
  target.speed.x += direction.x * speedFactor;
  target.speed.y += direction.y * speedFactor;
}

// slimeAvoid
export function slimeAvoid(aura, slime){
  let dx = aura.position.x - slime.position.x;
  let dy = aura.position.y - slime.position.y;
  let distance = Math.sqrt(dx*dx + dy*dy);
  let direction = {x: dx/distance, y: dy/distance};
  // speed factor of direction
  let speedFactor = 0.05; 
  slime.speed.x -= direction.x * speedFactor;
  slime.speed.y -= direction.y * speedFactor;
}