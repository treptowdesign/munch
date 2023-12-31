import pkg from 'raylib';
import {hexToRGB, colorGradient} from '../Utilities/helpers.js'
import {GLOBALS} from '../globals.js'
const r = pkg;

const minSize = GLOBALS.game.minSize;
const maxSize = GLOBALS.game.maxSize;

export class Slime {
    constructor(position, size, speed) {
        this.position = position || {x: 0, y: 0};
        this.size = size || 50;
        this.speed = speed || {x: 0, y: 0};
        this.radiusH = 0;
        this.radiusV = 0;
        this.angle = r.GetRandomValue(0, 359);
        this.startColor = hexToRGB("#e0cfbd"); // start color when size is minSize
        this.endColor = hexToRGB("#d0413d"); // end color when size is maxSize
        this.isColliding = 0;
      }
      getColor() {
        let ratio = (this.size - minSize) / (maxSize - minSize);
        return colorGradient(this.startColor, this.endColor, ratio);
      }
      move(){
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.isColliding = Math.max(this.isColliding -1, 0);
      }
      doCollision(entity){
        // special collision logic (off)
      }
      updateRadii() { 
        // sine wave deform
        const timeH = Date.now() / 600;  
        const timeV = Date.now() / 600;
        this.radiusH = this.size +  Math.sin(timeH) * (this.size / 15);  // Radius changes between 1/10 of size
        this.radiusV = this.size + Math.cos(timeV) * (this.size / 15);  // Radius changes between 1/10 of size
      }
      updateAngle() {
        // this.angle = r.GetRandomValue(0, 359);
      }
      draw(){
        this.updateRadii();
        // this.updateAngle();
        r.rlPushMatrix();
        r.rlTranslatef(this.position.x, this.position.y, 0);
        r.rlRotatef(this.angle, 0, 0, 1);
        // draw
        r.DrawEllipse(0, 0, this.radiusH, this.radiusV, this.getColor());  // drawing at (0, 0) because we've translated the canvas
        r.rlPopMatrix();

        // r.DrawText('Angle: ' + this.angle, this.position.x, this.position.y, 12, r.DARKGRAY);
      }
}

export class SpecialSlime extends Slime {
    constructor(position, size, speed) {
        super(position, size, speed);
        // purple color
        this.startColor = hexToRGB("#D1B3E6");
        this.endColor = hexToRGB("#5D2555");
      }
      doCollision(entity){
        // special collision logic (off)
      }
}
