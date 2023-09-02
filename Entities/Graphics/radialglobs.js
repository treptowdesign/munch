import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees, getVector} from '../../Utilities/helpers.js';

import { LineWave } from './linewave.js';
import { Glob } from './glob.js';
import { Spike } from './spike.js';

export class RadialGlobs {
    constructor({position = r.Vector2(0, 0), number = 10, size = 40, color = clr('white', 7)} = {}) {
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
                position: r.Vector2(0, 0), 
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
