import pkg from 'raylib';
import { GLOBALS } from '../globals.js'
const r = pkg;

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
  let vector = {x: (speedX * vX), y: (speedY * vY)};
  return vector;
}

// returns a random 1 or 0
export function randBool(){
  return r.GetRandomValue(0, 1) == 0 ? false : true;
}

// rotate a point by an angle
// this rotates a x,y point around (0, 0), translation needs to be done outside
export function rotatePoint(point, angleDeg) {
  const angleRad = angleDeg * Math.PI / 180; // degreesToRadians
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos
  };
}

// abstracted raylib transform/rotate
export function matrixRotate(origin, angle, drawCallback){
  // push into matrix
  r.rlPushMatrix();
  // origin x/y to center at translate position
  r.rlTranslatef(origin.x, origin.y, 0);
  // rotation
  r.rlRotatef(angle * (180 / Math.PI), 0, 0, 1); // radiansToDegrees
  // draw callback
  drawCallback();
  // pop out of matrix
  r.rlPopMatrix();
}

// add two vertices together
export function addVertices(v1, v2){
  return { x: (v1.x + v2.x), y: (v1.y + v2.y) };
}

// Convert degrees to radians
export function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Convert radians to degrees
export function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}














  // export function exchangeSize(entityA, entityB){
  //   if(entityB.size < entityA.size){
  //     let scaleFactor = (1 * (entityB.size / entityA.size));
  //     entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
  //   } else if(entityB.size > entityA.size) {
  //     let scaleFactor = (1 * (entityA.size / entityB.size));
  //     entityA.size = Math.max(entityA.size - scaleFactor, minSize);
  //   } else {
  //     entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1); 
  //   } 
  // }
  
  // export function exchangeSize2(entityA, entityB){
  //   // console.log('special collide!');
  //   if(entityB.size < entityA.size){
  //     let scaleFactor = (2 * (entityB.size / entityA.size));
  //     entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
  //   } else if(entityB.size > entityA.size) {
  //     let scaleFactor = (2 * (entityA.size / entityB.size));
  //     entityA.size = Math.max(entityA.size - scaleFactor, minSize);
  //   } else {
  //     entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1); 
  //   } 
  // }
  
  // export function exchangeSizeB(entityA, entityB){
  //   if(entityB.size < entityA.size){
  //     let sizeDifference = entityA.size - entityB.size;
  //     let scaleFactor = 1 - sizeDifference / (maxSize - minSize); // scaleFactor is closer to 1 when sizes are close
  //     entityA.size = Math.min(entityA.size + scaleFactor, maxSize);
  //   } else if(entityB.size > entityA.size) {
  //     let sizeDifference = entityB.size - entityA.size;
  //     let scaleFactor = 1 - sizeDifference / (maxSize - minSize); // scaleFactor is closer to 1 when sizes are close
  //     entityA.size = Math.max(entityA.size - scaleFactor, minSize);
  //   } else {
  //     // same size - randomize size change +/-
  //     entityA.size = randBool ? minMax(entityA.size + 1) : minMax(entityA.size - 1);
  //   }
  // }