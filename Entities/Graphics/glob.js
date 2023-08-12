import pkg from 'raylib';
const r = pkg;

import {clr} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, addVertices, degreesToRadians, radiansToDegrees} from '../../Utilities/helpers.js';

export class Glob {
    constructor({ // defaults
        position = {x: 0, y: 0}, 
        size = 10, 
        angle = 0, 
        color = clr('white', 7),
        deformRate = 600,
        deformAmount = 20,
        offset = 0
    } = {}) {
        this.position = position || {x: 0, y: 0};
        this.size = size;
        this.radiusH = 0;
        this.radiusV = 0;
        this.angle = angle;
        this.color = color;
        this.deformRate = deformRate; // speed at which it deforms (sine freq)
        this.deformAmount = deformAmount; // % of size it can deform
        this.offset = offset;
      }
      update(){
        // sine wave deform
        const timeH = Date.now() / this.deformRate;  
        const timeV = Date.now() / this.deformRate;
        this.radiusH = this.size +  Math.sin(timeH) * (this.size / this.deformAmount);  // Radius changes between 1/10 of size
        this.radiusV = this.size + Math.cos(timeV) * (this.size / this.deformAmount);  // Radius changes between 1/10 of size
      }
      draw(){
        let that = this; // preserve scope for callback
        // matrix, translate, rotate & draw
        matrixRotate(this.position, this.angle, function(){ // origin, angle, draw as callback
            r.DrawEllipse(0 + that.offset, 0, that.radiusH, that.radiusV, that.color);  
        });
        // r.DrawText('Angle: ' + this.angle, this.position.x, this.position.y, 12, r.DARKGRAY);
      }
}