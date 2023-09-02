import pkg from 'raylib';
const r = pkg;

import {clr} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees} from '../../Utilities/helpers.js';

export class LineWave {
    constructor({ // defaults
        position = r.Vector2(0, 0), 
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
