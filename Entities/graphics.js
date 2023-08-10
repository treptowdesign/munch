import pkg from 'raylib';
const r = pkg;

import {clr} from '../Utilities/color.js';
import {matrixRotate, rotatePoint, addVertices, degreesToRadians, radiansToDegrees} from '../Utilities/helpers.js';

/////////////////////////////////////////////////////////////////////////////
//
//
//
// LineWave
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class LineWave {
    constructor({ // defaults
        position = {x: 0, y: 0}, 
        length, 
        amplitude, 
        frequency, 
        speed, 
        phase = 0, 
        offset = 0, 
        thickness = 1,
        color = clr('white', 7),
        nodes = {start: false, end: false, color: clr('white', 7), size: 4}
    } = {}) {
        this.position = position;
        this.length = length;
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.speed = speed;
        this.phase = phase;
        this.thickness = thickness;
        this.offset = offset;
        this.color = color;
        this.pointCount = 0;
        this.points = [];
        this.nodes = nodes;
        this.initialize();
    }
    initialize(){
        this.pointCount = Math.ceil(this.length - this.offset);
    }
    update() {
        // increase the phase to move the wave over time
        this.phase += this.speed * r.GetFrameTime();
        // clear points
        this.points = [];
        // calc next round of points
        for (let i = 0; i < this.pointCount; i++) {
            let ampScale = i/this.pointCount; // percent for anchoring origin point
            let x = (this.offset + this.position.x) + i;
            let y = this.position.y + (ampScale * this.amplitude) * Math.sin(2 * Math.PI * (this.frequency * i / this.pointCount + this.phase));
            this.points.push({x, y});
        }
    }
    draw() {
        // draw line w/ points
        for(let i = 0; i < this.points.length - 1; i++) {
            let dx = this.points[i+1].x - this.points[i].x;
            let dy = this.points[i+1].y - this.points[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx);
            let that = this; // preserve scope for callback
            // use matrix to translate & rotate
            matrixRotate(this.points[i], angle, function(){ // origin, angle, draw as callback
                r.DrawRectangleLines(0, -that.thickness / 2, distance, that.thickness, that.color);
            });
            // draw doodads (circle on start and end cap)
            if(this.nodes.start){
                r.DrawCircleV(this.points[0], this.nodes.size, this.nodes.color);
            }
            if(this.nodes.end){
             r.DrawCircleV(this.points[this.pointCount -1], this.nodes.size, this.nodes.color); 
            } 
        }
    }
}


/////////////////////////////////////////////////////////////////////////////
//
//
//
// Glob
//
//
//
/////////////////////////////////////////////////////////////////////////////
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

/////////////////////////////////////////////////////////////////////////////
//
//
//
// Spike
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class Spike {
    constructor({ // defaults
        position = {x: 0, y: 0}, 
        height = 10, 
        width = 10,
        angle = 0, 
        color = clr('white', 7),
        offset = 0,
        vertices = {v1: {x: 0, y: 0}, v2: {x: 0, y: 0}, v3: {x: 0, y: 0}},
        phase = 0,
        // rotated
        rotAngle = 0,
        parent
    } = {}) {
        this.position = position;
        this.height = height,
        this.width = width,
        this.angle = angle;
        this.color = color;
        this.offset = offset;
        this.vertices = vertices,
        this.phase = phase,
        this.bounce = 0;
        this.bounceRate = 400;
        // rotated...
        this.rotVerts = {v1: {x: 0, y: 0}, v2: {x: 0, y: 0}, v3: {x: 0, y: 0}};
        this.rotAngle = rotAngle,
        this.parent = parent
      }
      update(){
        // update...
        let bounceTime = Date.now() / this.bounceRate;
        let bounceFactor = Math.sin(bounceTime * this.phase);
        // this.bounce = bounceFactor;
        this.bounce = (this.offset * 0.8) + (this.offset * 0.1 * bounceFactor);
        // update spike points
        this.vertices.v1 = r.Vector2((0 + this.height + this.bounce), 0);
        this.vertices.v2 = r.Vector2(0 + this.bounce, -(this.width/2) + 0);
        this.vertices.v3 = r.Vector2(0 + this.bounce, (this.width/2) + 0);
        // store rotated points
        let pOrigin = this.parent.position;
        let pAngle = radiansToDegrees(this.parent.angle); // radiansToDegrees
        // handle translate & rotation
        this.rotVerts.v1 = rotatePoint(addVertices(this.position, this.vertices.v1), this.rotAngle + pAngle);
        this.rotVerts.v1 = addVertices(this.rotVerts.v1, pOrigin);
      }
      draw(){
        let that = this; // preserve scope for callback
        matrixRotate(this.position, this.angle, function(){ // origin, angle, draw as callback
            r.DrawTriangle(that.vertices.v1, that.vertices.v2, that.vertices.v3, that.color); // spike 
            // r.DrawCircleV({x: 0, y: 0}, 2, clr('green', 5)); // origin
            // r.DrawCircleV(that.vertices.v1, 2, clr('red', 5)); // point
            // r.DrawText('Phase: ' + that.phase, that.offset, 0, 12, clr('white', 7));
        });
        // draw collision point
        // r.DrawCircleV(rotatePoint(this.vertices.v1, this.angle), 2, clr('green', 5));
      }
}


/////////////////////////////////////////////////////////////////////////////
//
//
//
// Radial Flagella
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class RadialFlagella {
    constructor({position = {x: 0, y: 0}, number = 10, length = 100, size = 40, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.length = length; // length of each arm
        this.size = size; // origin offset
        this.color = color;
        this.arms = []; // holds all the arms
        this.body = false;
        this.initialize();
    }
    initialize() {
        // divide a full circle into even segments based on the number of arms
        const angleStep = 2 * Math.PI / this.number;
        for (let i = 0; i < this.number; i++) {
            // variable phase
            let phase = Math.random();
            // create new LineWave for each arm
            let arm = new LineWave({
                position: {x: 0, y: 0},
                length: this.length,
                amplitude: 5,
                frequency: 2,
                speed: 0.5,
                phase: phase,
                offset: this.size, // size of the slime in the center
                thickness: 2, // line stroke
                color: clr('steel', 7, 75),
                nodes: {start: true, end: true, color: this.color, size: (this.size/10)}
            });
            // save angle of this arm for drawing - used only in this class so dont pass to LineWave 
            arm.angle = angleStep * i;
            // add the new arm to the list
            this.arms.push(arm);
        }
        // glob: position, 
        this.body = new Glob({
            position: this.position,
            size: this.size,
            color: this.color
        });
    }
    update() {
        // update all arms
        for (let arm of this.arms) {
            arm.update();
        }
        // update glob
        this.body.update();
    }
    draw() {
        // draw all arms
        for (let arm of this.arms) {
            // use matrix to translate & rotate
            matrixRotate(this.position, arm.angle, function(){ // origin, angle, draw as callback
                arm.draw();
            });
        }
        // draw slime body
        this.body.draw();
    }
}

/////////////////////////////////////////////////////////////////////////////
//
//
//
// Radial Globs
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class RadialGlobs {
    constructor({position = {x: 0, y: 0}, number = 10, size = 40, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.size = size; // origin offset
        this.color = color;
        this.arms = []; // holds all the arms
        this.body = false;
        this.initialize();
    }
    initialize() {
        // divide a full circle into even segments based on the number of arms
        const angleStep = 2 * Math.PI / this.number;
        for (let i = 0; i < this.number; i++) {
            // create new LineWave for each arm
            let arm = new Glob({
                position: {x: 0, y: 0}, 
                size: (this.size / 8), 
                angle: 0, 
                color: this.color,
                deformRate: 600,
                deformAmount: 20,
                offset: this.size
            });
            // save angle of this arm for drawing - used only in this class so dont pass to LineWave 
            arm.pivotAngle = angleStep * i;
            // add the new arm to the list
            this.arms.push(arm);
        }
        // glob: position, 
        this.body = new Glob({
            position: this.position,
            size: this.size,
            color: this.color
        });
    }
    update() {
        // update all arms
        for (let arm of this.arms) {
            arm.update();
        }
        // update glob
        this.body.update();
    }
    draw() {
        // draw slime body
        this.body.draw();
        // draw all arms
        for (let arm of this.arms) {
            // use matrix to translate & rotate
            matrixRotate(this.position, arm.pivotAngle, function(){ // origin, angle, draw as callback
                arm.draw();
            });
        }
    }
}

/////////////////////////////////////////////////////////////////////////////
//
//
//
// Radial Spikes
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class RadialSpikes {
    constructor({position = {x: 0, y: 0}, number = 16, size = 40, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.size = size; // origin offset
        this.arms = []; // holds all the arms
        this.body = false;
        this.color = color;
        this.angle = 0
        this.initialize();
    }
    initialize() {
        // divide a full circle into even segments based on the number of arms
        const angleStep = 2 * Math.PI / this.number;
        for (let i = 0; i < this.number; i++) {
            // create new LineWave for each arm
            let phase = Math.random();
            let arm = new Spike({
                position: {x: 0 , y: 0}, 
                height: 25, 
                width: 15, 
                offset: this.size,
                color: this.color,
                phase: phase,
                rotAngle: (angleStep * i) * (180 / Math.PI),
                parent: this
            });
            // save angle of this arm for drawing - used only in this class so dont pass to LineWave 
            arm.pivotAngle = angleStep * i;
            // add the new arm to the list
            this.arms.push(arm);
        }
        // glob: position, 
        this.body = new Glob({
            position: this.position,
            size: this.size,
            color: this.color
        });
    }
    update() {
        // update all arms
        for (let arm of this.arms) {
            arm.update();
        }
        // update glob
        this.body.update();
        // rotate over time...
        this.angle += 0.005;
    }
    draw() {
        let that = this; // preserve scope for callback
        // draw all arms
        matrixRotate(this.position, this.angle, function(){ // origin, angle, draw as callback
            for (let arm of that.arms) {
                // use matrix to translate & rotate
                matrixRotate({x: 0, y: 0}, arm.pivotAngle, function(){ // origin, angle, draw as callback
                    arm.draw();
                });
            }
        });
        // draw real world points (rotated twice)
        for (let arm of this.arms) {
            r.DrawCircleV(arm.rotVerts.v1, 2, clr('green', 5)); // point
        }
        let arm = this.arms[0];
        r.DrawCircleV(arm.rotVerts.v1, 2, clr('green', 7)); // point
        // draw slime body
        this.body.draw();
    }
}


/////////////////////////////////////////////////////////////////////////////
//
//
//
// TripleTail
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class TripleTail {
    constructor({position = {x: 0, y: 0}, length = 100, size = 30, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.length = length; // length of each arm
        this.size = size;
        this.color = color;
        this.number = 3; // number of arms
        this.arms = []; // holds all the arms
        this.angle = degreesToRadians(180); // faces backwards, get rads from degree 
        this.initialize();
    }
    initialize() {
        // big arm
        // variable phase
            let phase = Math.random();
            console.log(phase);
            let frequency = 2
            // create big arm
            let arm = new LineWave({
                position: {x: 0, y: 0},
                length: this.length,
                amplitude: 5,
                frequency: frequency,
                speed: 0.5,
                phase: phase,
                offset: this.size, // size of the slime in the center
                thickness: 2, // line stroke
                color: clr('steel', 7, 75),
                nodes: {start: true, end: false, color: this.color, size: this.size/5}
            });
            // save angle of this arm for drawing - used only in this class so dont pass to LineWave 
            this.arms.push(arm);
            // create small arms
            for (let i = 0; i < (this.number -1); i++) {
                phase = Math.random(); // rando for 2nd arm
                console.log(phase);
                // frequency = Math.random();
                arm = new LineWave({
                    position: {x: 0, y: 0},
                    length: (this.length * 0.75),
                    amplitude: 12,
                    frequency: frequency,
                    speed: 0.5,
                    phase: phase,
                    offset: this.size, // size of the slime in the center
                    thickness: 2, // line stroke
                    color: clr('steel', 7, 75),
                    nodes: {start: true, end: false, color: this.color, size: this.size/5}
                });
                this.arms.push(arm);
            }
    }
    update() {
        // update all arms
        for (let arm of this.arms) {
            arm.update();
        }
    }
    draw() {
        // draw all arms
        for (let arm of this.arms) {
            // use matrix to translate & rotate
            matrixRotate(this.position, this.angle, function(){ // origin, angle, draw as callback
                arm.draw();
            });
        }
        // draw slime body
        r.DrawCircleV(this.position, 30, this.color);
        r.DrawCircleV(this.position, (30 * 0.9), clr('steel', 5, 60));
    }
}

/////////////////////////////////////////////////////////////////////////////
//
//
//
// NEXT
//
//
//
/////////////////////////////////////////////////////////////////////////////
