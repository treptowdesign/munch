import pkg from 'raylib';
import { GLOBALS } from '../globals.js'
const r = pkg;

export function hexToRGB(hex, alpha) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length == 4) {
      r = "0x" + hex[1] + hex[1];
      g = "0x" + hex[2] + hex[2];
      b = "0x" + hex[3] + hex[3];
    }
    // 6 digits
    else if (hex.length == 7) {
      r = "0x" + hex[1] + hex[2];
      g = "0x" + hex[3] + hex[4];
      b = "0x" + hex[5] + hex[6];
    }
    return {r: +r, g: +g, b: +b, a: 255};
  }

// returns true if out of bounds, includes an optional offscreen buffer
export function oob(pos, buffer){
    if(
        pos.x > GLOBALS.screen.width + buffer || 
        pos.x < -buffer ||
        pos.y > GLOBALS.screen.height + buffer ||
        pos.y < -buffer
    ){
      return true;
    } else {
      return false;
    }
}

// start off screen (60px buffer)
export function getOffscreenPoint(){
    const randHW = randBool(); // choose height or width at random
    const posNeg = randBool(); // choose positive or negative at random
    let randX, randY;
    if(randHW){ // use width
      randX = r.GetRandomValue(-60, GLOBALS.screen.width + 60);
      randY = (posNeg) ? -60 : GLOBALS.screen.height + 60; 
    } else { // use height
      randY = r.GetRandomValue(-60, GLOBALS.screen.height + 60);
      randX = (posNeg) ? -60 : GLOBALS.screen.width + 60;
    }
    return {x: randX, y: randY}
  }
  
  // get random point on screen
  export function getOnscreenPoint(){
    const randX = r.GetRandomValue(0, GLOBALS.screen.width);
    const randY = r.GetRandomValue(0, GLOBALS.screen.height);
    return {x: randX, y: randY}
  }
  
  // Take starting position determine its direction & speed
  export function getVector(pos){
    let speedX = r.GetRandomValue(50, 200) / 100;
    let speedY = r.GetRandomValue(50, 200) / 100;
    let vX = (pos.x < (GLOBALS.screen.width/2)) ? 1 : -1;
    let vY = (pos.y < (GLOBALS.screen.height/2)) ? 1 : -1;
    let vector = {x: (speedX * vX), y: (speedY * vY)}
    return vector
  }

// constrain size to min/max values
// export function minMax(value){
//     return Math.min(Math.max(value, GLOBALS.game.minSize), GLOBALS.game.maxSize);
// }

// returns a random 1 or 0
export function randBool(){
  return r.GetRandomValue(0, 1) == 0 ? false : true;
}

// returns a blend between two colors at a certain %
export function colorGradient(start, end, ratio){
    return {
      r: Math.round(start.r + ratio * (end.r - start.r)),
      g: Math.round(start.g + ratio * (end.g - start.g)),
      b: Math.round(start.b + ratio * (end.b - start.b)),
      a: 255
    };
  }









  export function exchangeSize(entityA, entityB){
    if(entityB.size < entityA.size){
      let scaleFactor = (1 * (entityB.size / entityA.size));
      entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
    } else if(entityB.size > entityA.size) {
      let scaleFactor = (1 * (entityA.size / entityB.size));
      entityA.size = Math.max(entityA.size - scaleFactor, minSize);
    } else {
      entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1); 
    } 
  }
  
  export function exchangeSize2(entityA, entityB){
    // console.log('special collide!');
    if(entityB.size < entityA.size){
      let scaleFactor = (2 * (entityB.size / entityA.size));
      entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
    } else if(entityB.size > entityA.size) {
      let scaleFactor = (2 * (entityA.size / entityB.size));
      entityA.size = Math.max(entityA.size - scaleFactor, minSize);
    } else {
      entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1); 
    } 
  }
  
  export function exchangeSizeB(entityA, entityB){
    if(entityB.size < entityA.size){
      let sizeDifference = entityA.size - entityB.size;
      let scaleFactor = 1 - sizeDifference / (maxSize - minSize); // scaleFactor is closer to 1 when sizes are close
      entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
    } else if(entityB.size > entityA.size) {
      let sizeDifference = entityB.size - entityA.size;
      let scaleFactor = 1 - sizeDifference / (maxSize - minSize); // scaleFactor is closer to 1 when sizes are close
      entityA.size = Math.max(entityA.size - scaleFactor, minSize);
    } else {
      // same size - randomize size change +/-
      entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1);
    }
  }