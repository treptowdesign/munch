import pkg from 'raylib';
import {clr, colorGradient} from '../Utilities/color.js';
import {GLOBALS} from '../globals.js'
import {genAura} from '../Utilities/generators.js';
const r = pkg;

const minSize = GLOBALS.game.minSize;
const maxSize = GLOBALS.game.maxSize;

export class Slime {
    constructor(position, size, speed) {
        this.type = 'default';
        this.position = position || {x: 0, y: 0};
        this.size = size || 50;
        this.speed = speed || {x: 0, y: 0};
        this.radiusH = 0;
        this.radiusV = 0;
        this.angle = r.GetRandomValue(0, 359);
        this.startColor = clr('pink', 5);
        this.endColor = clr('pink', 4); 
        this.isColliding = 0;
        this.alive = true;
      }
      initializeAura(){
        // no aura on regular slime
      }
      getColor() {
        let ratio = (this.size - minSize) / (maxSize - minSize);
        return colorGradient(this.startColor, this.endColor, ratio);
      }
      update(){
        // deform
        this.updateRadii();
        // movement
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.isColliding = Math.max(this.isColliding -1, 0);
      }
      doCollision(entity){
        // special collision logic here
      }
      updateRadii() { 
        // sine wave deform
        const timeH = Date.now() / 600;  
        const timeV = Date.now() / 600;
        this.radiusH = this.size +  Math.sin(timeH) * (this.size / 15);  // Radius changes between 1/10 of size
        this.radiusV = this.size + Math.cos(timeV) * (this.size / 15);  // Radius changes between 1/10 of size
      }
      draw(){
        // matrix, translate, rotate & draw
        r.rlPushMatrix();
        r.rlTranslatef(this.position.x, this.position.y, 0);
        r.rlRotatef(this.angle, 0, 0, 1);
        r.DrawEllipse(0, 0, this.radiusH, this.radiusV, this.getColor());  // drawing at (0, 0) because we've translated the canvas
        r.rlPopMatrix();
        // r.DrawText('Angle: ' + this.angle, this.position.x, this.position.y, 12, r.DARKGRAY);
      }
}

export class Hunter extends Slime {
    constructor(position, size, speed) {
        super(position, size, speed);
        this.type = 'hunter';
        // purple color
        this.startColor = clr('red', 5); // start color when size is minSize
        this.endColor = clr('red', 4); // end color when size is maxSize
      }
      initializeAura(){
        // generate aura, pass in parent & scale factor (5x bigger radius)
        genAura(this, 5);
      }
      update(){
        // deform
        this.updateRadii();
        // movement
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
        this.isColliding = Math.max(this.isColliding -1, 0);
      }
      draw(){
        // aura
        // matrix, translate, rotate & draw
        r.rlPushMatrix();
        r.rlTranslatef(this.position.x, this.position.y, 0);
        r.rlRotatef(this.angle, 0, 0, 1);
        r.DrawEllipse(0, 0, this.radiusH, this.radiusV, this.getColor());  // drawing at (0, 0) because we've translated the canvas
        r.rlPopMatrix();
        // r.DrawText('Angle: ' + this.angle, this.position.x, this.position.y, 12, r.DARKGRAY);
      }
}
