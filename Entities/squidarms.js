import pkg from 'raylib';
const r = pkg;

import {clr} from '../Utilities/color.js';
import {LineWave} from "./linewave.js";

export class SquidArms {
    constructor(position, number, size) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.size = size; // length of each arm
        this.arms = []; // holds all the arms
        this.initializeArms();
    }
    initializeArms() {
        // divide a full circle into even segments based on the number of arms
        const angleStep = 2 * Math.PI / this.number;
        for (let i = 0; i < this.number; i++) {
            // variable phase
            let phase = Math.random();
            // create new LineWave for each arm
            // position, length, amplitude, frequency, speed, phase, x-offset
            let arm = new LineWave({x: 0, y:0}, this.size, 5, 2, 0.5, phase, 40);
            // save angle of this arm for drawing - used only in this class so dont pass to constructor 
            arm.angle = angleStep * i;
            // add the new arm to the list
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
            r.rlPushMatrix();
            r.rlTranslatef(this.position.x, this.position.y, 0);
            r.rlRotatef(arm.angle * (180 / Math.PI), 0, 0, 1);
            arm.draw();
            r.rlPopMatrix();
        }
        // draw slime body
        r.DrawCircleV(this.position, 40, clr('blue', 5));
    }
}
