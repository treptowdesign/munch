import pkg from 'raylib';
import {hexToRGB, colorGradient} from '../Utilities/helpers.js'
import {GLOBALS} from '../globals.js'
const r = pkg;

const screenWidth = GLOBALS.screen.width; //1400
const screenHeight = GLOBALS.screen.height; //800
const damp = GLOBALS.game.damp;
const minSize = GLOBALS.game.minSize;
const maxSize = GLOBALS.game.maxSize;

export class Player {
    constructor(){
      this.position = { x: screenWidth/2, y: screenHeight/2 };
      this.speed = { x: 0, y: 0 };
      this.size = 16;
      this.radiusH = 0;
      this.radiusV = 0;
      this.angle = 0;
      this.startColor = hexToRGB("#6dbfb0");
      this.endColor = hexToRGB("#60a1a7");
      this.isColliding = 0;
    }
    getColor() {
      let ratio = (this.size - minSize) / (maxSize - minSize);
      return colorGradient(this.startColor, this.endColor, ratio);
    }
    getAccceleration(){
      // return 0.5 * ((maxSize - this.size) / (maxSize - minSize)); 
      const scaleFactor = 0.5; 
      return scaleFactor * Math.log((maxSize - this.size) / (maxSize - minSize) + 1);
    }
    getMaxSpeed(){
      // return 5 * ((maxSize - this.size) / (maxSize - minSize)); 
      // const minSpeed = 1.25;
      // const maxSpeed = 5;
      // const ratio = (this.size - minSize) / (maxSize - minSize);
      // return minSpeed + ratio * (maxSpeed - minSpeed);
      const scaleFactor = 5 * Math.log((maxSize - this.size) / (maxSize - minSize) + 1);
      return Math.max(scaleFactor, 1.2); 
    }
    move(){
      // controls
      this.isColliding = Math.max(this.isColliding -1, 0);
      if(this.isColliding == 0){
        if (r.IsKeyDown(r.KEY_RIGHT)) {this.speed.x = Math.min(this.speed.x + this.getAccceleration(), this.getMaxSpeed())}; 
        if (r.IsKeyDown(r.KEY_LEFT)) {this.speed.x = Math.max(this.speed.x - this.getAccceleration(), -this.getMaxSpeed())};
        if (r.IsKeyDown(r.KEY_UP)) {this.speed.y = Math.max(this.speed.y - this.getAccceleration(), -this.getMaxSpeed())};
        if (r.IsKeyDown(r.KEY_DOWN)) {this.speed.y = Math.min(this.speed.y + this.getAccceleration(), this.getMaxSpeed())};
      }
      // update player position based on speed
      this.position.x += this.speed.x;
      this.position.y += this.speed.y;
      // apply damping to player speed
      this.speed.x *= damp;
      this.speed.y *= damp;
      // world wrap 
      if ( this.position.x < 0 - this.size) { this.position.x = screenWidth + this.size }
      if ( this.position.x > screenWidth + this.size) { this.position.x = 0 - this.size }
      if ( this.position.y < 0 - this.size) { this.position.y = screenHeight + this.size }
      if ( this.position.y > screenHeight + this.size) { this.position.y = 0 - this.size } 
    }
    doCollision(entity){
      // special collision logic (off)
    }
    updateRadii() { 
        // sine wave deform
        const timeH = Date.now() / 600;  
        const timeV = Date.now() / 600;
        let undulateH = Math.sin(timeH) * (this.size / 20);  // Radius changes between 1/10 of size
        let undulateV = Math.cos(timeV) * (this.size / 20);  // Radius changes between 1/10 of size
        // move deform
        const velocity = Math.max(Math.abs(this.speed.x), Math.abs(this.speed.y));
        const percSpeed = velocity/this.getMaxSpeed();
        const l = r.Lerp(1.0, .95, percSpeed)
        const l2 = r.Lerp(1.0, 1.15, percSpeed)
        this.radiusH = (this.size * l2) + undulateH ;  // Radius changes between 1/10 of size
        this.radiusV = (this.size * l) + undulateV;  // Radius changes between 1/10 of size
    }
    updateAngle(){
      // rotate...
      // this.angle = (this.angle + 1) % 360;
      // this.angle = Math.atan2(this.speed.y, this.speed.x) * 180 / Math.PI;

      let targetAngle = Math.atan2(this.speed.y, this.speed.x) * 180 / Math.PI;
      
      // Adjust angles to be on the same 2*PI domain
      let currentAngleRad = this.angle * Math.PI / 180;
      let targetAngleRad = targetAngle * Math.PI / 180;
      let angleTransitionSpeed = 0.2;
      
      if (Math.abs(currentAngleRad - targetAngleRad) > Math.PI) {
        if (targetAngleRad > currentAngleRad) {
          currentAngleRad += 2 * Math.PI;
        } else {
          targetAngleRad += 2 * Math.PI;
        }
      }
      
      // Interpolate the angles
      let interpolatedAngleRad = currentAngleRad + angleTransitionSpeed * (targetAngleRad - currentAngleRad);
      this.angle = (interpolatedAngleRad * 180 / Math.PI + 360) % 360;
    }
    draw(){
      // undulate...
      this.updateRadii();
      this.updateAngle();

      r.rlPushMatrix();
      r.rlTranslatef(this.position.x, this.position.y, 0);
      r.rlRotatef(this.angle,0,0,1);
      // draw
      r.DrawEllipse(0, 0, this.radiusH, this.radiusV, this.getColor());  // drawing at (0, 0) because we've translated the canvas
      r.rlPopMatrix();
      // r.DrawCircleV(this.position, this.size, this.getColor());
      // r.DrawText('R: ' + this.radiusH + ', '+this.radiusV, this.position.x, this.position.y, 12, r.DARKGRAY); 
    }
  }