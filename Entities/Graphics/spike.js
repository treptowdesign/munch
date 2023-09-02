import pkg from 'raylib';
const r = pkg;

import {clr} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees} from '../../Utilities/helpers.js';

export class Spike {
    constructor({ // defaults
        position = r.Vector2(0, 0), 
        height = 10, 
        width = 10,
        angle = 0,
        offset = 0, 
        phase = 0, 
        bounceRate = 400,
        bounceAmount = 0.8 
    } = {}) {
        this.position = position; // origin x/y
        this.height = height,
        this.width = width,
        this.angle = angle;
        this.offset = offset;  // x offset for rotation around origin
        this.phase = phase,  // for bounce animation
        this.bounceRate = bounceRate, // speed of bounce animation
        this.bounceAmount = bounceAmount; // applied to offset
        this.vertices = [],
        this.bounce = 0;
      }
      update(){
        // update x offset bounce over time
        let bounceTime = Date.now() / this.bounceRate;
        let bounceFactor = Math.sin(bounceTime * this.phase);
        this.bounce = (this.offset * this.bounceAmount) + (this.offset * 0.1 * bounceFactor);
        // update spike points based in height/width (0 is origin) & bunce
        this.vertices[0] = r.Vector2((this.bounce + this.height), 0);
        this.vertices[1] = r.Vector2(this.bounce, -(this.width/2));
        this.vertices[2] = r.Vector2(this.bounce, (this.width/2));
        // update points based on rotation
        this.vertices.forEach((v, i) => { 
          this.vertices[i] = rotatePoint(v, this.angle); 
        });
      }
}