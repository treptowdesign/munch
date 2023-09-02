import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees, getVector} from '../../Utilities/helpers.js';

import { LineWave } from './linewave.js';
import { Glob } from './glob.js';
import { Spike } from './spike.js';

export class TripleTail {
    constructor({position = r.Vector2(0, 0), length = 100, size = 30, color = clr('white', 7)} = {}) {
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
                position: r.Vector2(0, 0),
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
                    position: r.Vector2(0, 0),
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
