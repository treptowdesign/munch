import pkg from 'raylib';
import {clr} from '../Utilities/color.js';
import {GLOBALS} from '../globals.js'

const r = pkg;

export class Aura {
    constructor(parent, scale) {
      this.parent = parent;
      this.scale = scale;
      this.position = parent.position;
      this.size = parent.size * scale;
      // this.alive = true;
    }
    update(){
      // this.position = this.parent.position;
      // this.size = this.parent.size * this.scale;
      // this.alive = this.parent.alive;
    }
    draw(){
        r.DrawCircleV(this.position, this.size, clr('pink', 6, 20));
    }
  }