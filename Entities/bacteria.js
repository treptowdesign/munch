import pkg from 'raylib';
import {hexToRGB, randBool, colorGradient} from '../Utilities/helpers.js'
import {GLOBALS} from '../globals.js'

const r = pkg;
const damp = GLOBALS.game.damp;

export class Bacteria {
    constructor(position) {
      this.position = position || {x: 0, y: 0};
      this.speed = {x: 0, y: 0};
      this.size = 4;
      this.color = hexToRGB("#a4d7f5"); 
      this.isColliding = 0;
      this.active = true;
      this.bonus = GLOBALS.game.bacteriaBonus;
    }
    getColor(){
        if(this.active){
            return hexToRGB("#a4d7f5");
        } else {
            //return hexToRGB("#e8e79e");
            return hexToRGB("#dddddd");
        }
    }
    update(){
      if(this.active){
        // bacteria jitter
        this.speed.x = r.GetRandomValue(0, 100) / 100;
        this.speed.y = r.GetRandomValue(0, 100) / 100;
        // update bacteria position based on speed
        this.position.x += randBool() ? - this.speed.x : this.speed.x;
        this.position.y += randBool() ? - this.speed.y : this.speed.y;
        // apply damping 
        this.speed.x *= damp;
        this.speed.y *= damp;
      } 
    }
    draw(){
      r.DrawCircleV(this.position, this.size, this.getColor());
    }
  }