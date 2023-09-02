import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees, getVector} from '../../Utilities/helpers.js';

import { LineWave } from './linewave.js';
import { Glob } from './glob.js';

export class RadialFlagella {
    constructor({position = r.Vector2(0, 0), number = 10, length = 100, size = 40, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.length = length; // length of each arm
        this.size = size; // origin offset
        this.color = color;
        this.arms = []; // holds all the arms
        this.body = false;
        this.angle = 0; // in degrees
        this.rotationSpeed = -10; // degrees / sec
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
                position: r.Vector2(0, 0),
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
            arm.angle = radiansToDegrees(angleStep * i); // get radians * step, convert to degrees
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
        // rotate over time using rotation speed
        this.angle = (this.angle + this.rotationSpeed * r.GetFrameTime()) % 360;
        if (this.angle < 0) { this.angle += 360; }
    }
    draw() {
        // preserve scope 
        let that = this;
        matrixRotate(this.position, this.angle, function(){ // origin, angle, draw as callback
            // draw all arms
            for (let arm of that.arms) {
                // use matrix to translate & rotate
                matrixRotate(r.Vector2(0,0), arm.angle, function(){ // origin, angle, draw as callback
                    arm.draw();
                });
            }
        });
        // draw slime body (move into matrix, wont display...)
        this.body.draw();
        
    }
}

export class Ciliate {
    constructor({position = r.Vector2(0, 0), number = 10, length = 100, size = 40, color = clr('white', 7)} = {}) {
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
                position: r.Vector2(0, 0),
                length: this.length,
                amplitude: 4,
                frequency: 2,
                speed: 0.5,
                phase: phase,
                offset: this.size, // size of the slime in the center
                thickness: 1, // line stroke
                color: clr('steel', 7, 75)
            });
            // save angle of this arm for drawing - used only in this class so dont pass to LineWave 
            arm.angle = radiansToDegrees(angleStep * i); // get radians * step, convert to degrees
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
