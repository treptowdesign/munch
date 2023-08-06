import pkg from 'raylib';
import {hexToRGB, colorGradient, rotatePoint} from '../Utilities/helpers.js'
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
      this.spike = {
        active: false,
        atkSpeed: 350,
        atkThrottled: false,
        timePassed: 0,
        length: 0,
        maxLength: 40,
        v1: 0, v2: 0, v3: 0,
        position: {x: 0, y: 0}, // spike tip position for collisions
        speed: {x: 0, y: 0}, // speed same as players for collisions
        size: 2,
        inertia: 0
      }
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
    update(){
      // undulate & rotate
      this.updateRadii();
      this.updateAngle();
      // controls
      this.isColliding = Math.max(this.isColliding -1, 0);
      if(this.isColliding == 0){
        if (r.IsKeyDown(r.KEY_RIGHT)) {this.speed.x = Math.min(this.speed.x + this.getAccceleration(), this.getMaxSpeed())}; 
        if (r.IsKeyDown(r.KEY_LEFT)) {this.speed.x = Math.max(this.speed.x - this.getAccceleration(), -this.getMaxSpeed())};
        if (r.IsKeyDown(r.KEY_UP)) {this.speed.y = Math.max(this.speed.y - this.getAccceleration(), -this.getMaxSpeed())};
        if (r.IsKeyDown(r.KEY_DOWN)) {this.speed.y = Math.min(this.speed.y + this.getAccceleration(), this.getMaxSpeed())};
      }
      // spacebar / spike
      if (r.IsKeyDown(r.KEY_SPACE) && !this.spike.active) {
        this.activateSpike();
      }
      this.updateSpike();
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
      // special collision logic here
    }
    updateRadii() { 
        // sine wave deform
        const timeH = Date.now() / 600;  
        const timeV = Date.now() / 600;
        let undulateH = Math.sin(timeH) * (this.size / 20);  // Radius changes between 1/x of size
        let undulateV = Math.cos(timeV) * (this.size / 20);  // Radius changes between 1/x of size
        // move deform
        const velocity = Math.max(Math.abs(this.speed.x), Math.abs(this.speed.y));
        const percSpeed = velocity/this.getMaxSpeed();
        const l = r.Lerp(1.0, .95, percSpeed)
        const l2 = r.Lerp(1.0, 1.15, percSpeed)
        this.radiusH = (this.size * l2) + undulateH ;  // Radius changes between 1/10 of size
        this.radiusV = (this.size * l) + undulateV;  // Radius changes between 1/10 of size
    }
    updateAngle(){
      // rotate
      let targetAngle = Math.atan2(this.speed.y, this.speed.x) * 180 / Math.PI;
      // adjust angles to be on the same 2*PI domain
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
      // interpolate the angles
      let interpolatedAngleRad = currentAngleRad + angleTransitionSpeed * (targetAngleRad - currentAngleRad);
      this.angle = (interpolatedAngleRad * 180 / Math.PI + 360) % 360;
    }
    activateSpike() {
      this.spike.active = true;
      this.spike.length = 0;
      this.spike.timePassed = 0; // track elapsed time
      this.spike.atkThrottled = false;// reset spike throttle
      // console.log('reset throttle (activate)');
    } 
    updateSpike() {
      // set spike maxLength by player size
      this.spike.maxLength = this.size * 4;
      // spike animation
      if (this.spike.active) {
        // inc by time passed with the elapsed time since last frame
        this.spike.timePassed += r.GetFrameTime() * 1000; // milliseconds
        let progress = this.spike.timePassed / this.spike.atkSpeed;
        if (progress < 0.5) { // increase the length
          this.spike.length = progress * 2 * this.spike.maxLength;
        } else { // decrease the length
          this.spike.length = (1 - progress) * 2 * this.spike.maxLength;
        }
        if (this.spike.timePassed >= this.spike.atkSpeed) {
          // deactivate spike after animation
          this.spike.active = false;
          this.spike.atkThrottled = false; // reset spike throttle
          // console.log('reset throttle (elapsed)');
        }
      }
      // get spike vertices (height of triangle is spike length)
      let width = this.radiusH/2;
      let height = this.spike.length;
      this.spike.v1 = r.Vector2(height, 0)
      this.spike.v2 = r.Vector2(0, -width)
      this.spike.v3 = r.Vector2(0, width)
      // set spike tip point & speed (for use in collisions)
      this.spike.position = r.Vector2(this.spike.length, 0); // local coords 
      this.spike.position = rotatePoint(this.spike.position, this.angle); // world coordinates = rotate/translate 
      this.spike.position.x += this.position.x;
      this.spike.position.y += this.position.y;
      this.spike.speed.x = this.speed.x;
      this.spike.speed.y = this.speed.y;
      this.spike.intertia = this.size;
    }
    draw(){
      // matrix, translate, rotate & draw
      r.rlPushMatrix();
      r.rlTranslatef(this.position.x, this.position.y, 0);
      r.rlRotatef(this.angle, 0, 0, 1);
      r.DrawTriangle(this.spike.v1, this.spike.v2, this.spike.v3, r.RED); // spike 
      r.DrawEllipse(0, 0, this.radiusH, this.radiusV, this.getColor());  // drawing at (0, 0) because we've translated the canvas
      r.rlPopMatrix();
      // attack point
      // r.DrawCircleV(this.spike.position, 2, r.GREEN);
      // r.DrawText('x: '+this.spike.timePassed, this.position.x, this.position.y, 12, r.DARKGRAY); 
    }
  }