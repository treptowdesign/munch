import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../Utilities/color.js';
import {matrixRotate, rotatePoint, addVertices, degreesToRadians, radiansToDegrees} from '../Utilities/helpers.js';

import { LineWave } from './Graphics/linewave.js';
import { Glob } from './Graphics/glob.js';
import { Spike } from './Graphics/spike.js';





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
        const angleStep = 2 * Math.PI / this.number; // RADIANS
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
            arm.angle = radiansToDegrees(angleStep * i);
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
        const angleStep = 2 * Math.PI / this.number; // RADIANS
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
            // arm angle (DEGREES)
            arm.pivotAngle = radiansToDegrees(angleStep * i);
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
        this.color = color;
        this.arms = []; // holds all the arms
        this.body = false;
        this.angle = 0;
        this.initialize();
    }
    initialize() {
        // divide a full circle into even segments based on the number of arms (in radians)
        const angleStep = (2 * Math.PI / this.number); // RADIANS
        for (let i = 0; i < this.number; i++) {
            // create new LineWave for each arm
            let phase = Math.random();
            let arm = new Spike({
                // position: {x: 0, y: 0}, 
                position: this.position, 
                height: 25, 
                width: 15, 
                offset: this.size,
                color: this.color,
                phase: phase,
                angle: radiansToDegrees(angleStep * i), // degrees
                rotAngle: (angleStep * i) * (180 / Math.PI), // radiansToDegrees 
            });
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
        for (let arm of this.arms) { arm.update(); }
        // update glob
        this.body.update();
        // rotate over time...
        this.angle += 0.005; // replace with property & appropriate time settings
    }
    draw() {
        // loop through each arm
        for (let arm of this.arms) {
            // loop through each point in the triangle
            let armPoints = [];
            for(let v of arm.vertices){
                const pAngle = radiansToDegrees(this.angle); // radiansToDegrees
                let point = rotatePoint(v, pAngle);
                point = addVertices(point, this.position);
                armPoints.push(point);
                r.DrawCircleV(point, 2, clr('green', 5)); // point
            }
            // draw triangle from points
            r.DrawTriangle(armPoints[0], armPoints[1], armPoints[2], this.color); // spike
        }
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
        this.angle = 180; // faces backwards (degrees)
        this.initialize();
    }
    initialize() {
        // big arm
        // variable phase
            let phase = Math.random();
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
// COLOR TEST
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class ColorTest {
    constructor({position = {x: 0, y: 0}, size = 40, colorKey = 'red'} = {}) {
        this.position = position;
        this.size = size; // origin offset
        this.colorKey = colorKey;
        this.initialize();
        this.color = 'red';
        this.factor = 0;
    }
    initialize(){
        console.log('color test active');
    }
    update(){
        let time = Date.now() / 1200;
        this.factor = Math.sin(time); // -1 to 1 in a sinewave
        // normalize to 1-100
        this.factor = ((this.factor - (-1)) / (1 - (-1))) * (100 - 0) + 0;
        // get color % by factor
        this.color = getColor(this.colorKey, this.factor);
    }
    draw(){
        r.DrawCircleV(this.position, this.size, this.color);
        r.DrawText(this.colorKey, (this.position.x - this.size/2), (this.position.y + this.size), 12, r.WHITE);
    }
}

/////////////////////////////////////////////////////////////////////////////
//
//
//
// TEMPLATE
//
//
//
/////////////////////////////////////////////////////////////////////////////
export class GraphicTemplate {
    constructor({position = {x: 0, y: 0}, size = 40, color = clr('white', 7)} = {}) {
        this.position = position;
        this.size = size; // origin offset
        this.color = color;
        this.angle = 0;
        this.initialize();
    }
    initialize(){
        console.log('template init');
    }
    update(){
        
    }
    draw(){
        r.DrawCircleV(this.position, this.size, this.color);
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