import pkg from 'raylib';
const r = pkg;

import {GLOBALS} from '../globals.js';
import {getOnscreenPoint, getOffscreenPoint, getVector} from '../Utilities/helpers.js';
import {checkCollision} from '../Utilities/collision.js';
import {Slime, Hunter} from "../Entities/slime.js";
import {Bacteria} from "../Entities/bacteria.js";
import {Aura} from "../Entities/aura.js";

export let slimeArray = [] 
export let bacteriaArray = [];
export let auraArray = [];

export function genBacteria(pos){
    let newBacteria = new Bacteria(pos || getOnscreenPoint());
    bacteriaArray.push(newBacteria);
}

export function genSlime(){
  let newSlime = null;
  let slimeType = r.GetRandomValue(1, 7);
  let pos = getOffscreenPoint();
  let randSize = r.GetRandomValue((GLOBALS.game.minSize * 100), ((GLOBALS.game.maxSize) * 100)) / 100;
  if(slimeType == 1){
    newSlime = new Hunter(pos, randSize, getVector(pos));
  } else {
    newSlime = new Slime(pos, randSize, getVector(pos));
  }
  // Only add the new slime if it wouldn't overlap with any existing slime
  let overlap = false;
  for (let i = 0; i < slimeArray.length; i++) {
    if(checkCollision(newSlime, slimeArray[i])){
      overlap = true;
      break;
    }
  }
  
  if(newSlime && !overlap) { 
    newSlime.initializeAura(); // init aura
    slimeArray.push(newSlime);
  }
  else { genSlime(); }
}

export function genAura(parent, scale){
  // create a new aura, set parent obj, add to auraArray (return aura?)
  let newAura = new Aura(parent, scale);
  // parent.newAura = newAura;
  auraArray.push(newAura);
}