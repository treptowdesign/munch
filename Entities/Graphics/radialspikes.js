import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees} from '../../Utilities/helpers.js';

import { Glob } from './glob.js'; 
import { Spike } from './spike.js'; 

export class RadialSpikes {
    constructor({position = r.Vector2(0, 0), number = 16, size = 40, color = clr('white', 7)} = {}) {
        this.position = position; // position of origin point
        this.number = number; // number of arms
        this.size = size; // origin offset
        this.color = color;
        this.arms = []; // holds all the arms
        this.body = false;
        this.angle = 0; // in degrees
        this.rotationSpeed = 10; // degrees / sec
        this.initialize();
    }
    initialize() {
        // divide a full circle into even segments based on the number of arms (in radians)
        const angleStep = (2 * Math.PI / this.number); // RADIANS
        for (let i = 0; i < this.number; i++) {
            // create new LineWave for each arm
            let phase = Math.random();
            let arm = new Spike({
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
        // rotate over time using rotation speed
        this.angle = (this.angle + this.rotationSpeed * r.GetFrameTime()) % 360;
        if (this.angle < 0) { this.angle += 360; }
    }
    draw() {
        // loop through each arm
        for (let arm of this.arms) {
            // loop through each point in the triangle, parent translate & rotate
            let armPoints = [];
            for(let v of arm.vertices){
                const pAngle = this.angle; // radiansToDegrees
                let point = rotatePoint(v, pAngle);
                point = r.Vector2Add(point, this.position);
                armPoints.push(point);
                r.DrawCircleV(point, 2, clr('green', 5)); // spike point (for collisions)
                // r.DrawCircleV(point, 2, this.color); // spike point (for collisions)
            }
            // draw triangle from points
            r.DrawTriangle(armPoints[0], armPoints[1], armPoints[2], this.color); // spike
        }
        // draw slime body
        this.body.draw();
        // data 
        // let dataX = this.position.x - this.size;
        // let dataY = this.position.y + this.size;
        // r.DrawText('A: ' + this.angle, dataX, dataY, 12, clr('white', 7, 70));
    }
}
