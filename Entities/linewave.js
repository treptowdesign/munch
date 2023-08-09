import pkg from 'raylib';
const r = pkg;

import {clr} from '../Utilities/color.js';

export class LineWave {
    constructor(position, length, amplitude, frequency, speed, phase, offset) {
        this.position = position ||  {x: 0, y: 0}; // position of origin point
        this.length = length;
        this.amplitude = amplitude; // wave height
        this.frequency = frequency; // num lines in line
        this.speed = speed; // how fast it moves
        this.phase = phase || 0; // wave start position
        this.thickness = 2; // stroke thickness of line 
        this.offset = offset || 0; // x offset (rotate around pos, draw at offset)
        this.startpoint = {x: 0, y: 0};
        this.endPoint = {x: 0, y: 0}
    }
    update() {
        // increase the phase to move the wave over time
        this.phase += this.speed * r.GetFrameTime();
    }
    draw() {
        // calc num points needed based on the line length
        const pointCount = Math.ceil(this.length - this.offset);
        const points = [];
        // calc each point
        for (let i = 0; i < pointCount; i++) {
            let ampScale = i/pointCount; // percent for anchoring origin point
            let x = (this.offset + this.position.x) + i;
            let y = this.position.y + (ampScale * this.amplitude) * Math.sin(2 * Math.PI * (this.frequency * i / pointCount + this.phase));
            points.push({x, y});
            // set startPoint & endPoint to hook on more doodads
            if(i == 0){ this.startPoint = r.Vector2(x, y); }
            if(i == pointCount -1){ this.endPoint = r.Vector2(x, y); }
        }
        // draw line w/ points
        for(let i = 0; i < points.length - 1; i++) {
            let dx = points[i+1].x - points[i].x;
            let dy = points[i+1].y - points[i].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx);
            r.rlPushMatrix();
            r.rlTranslatef(points[i].x, points[i].y, 0);
            r.rlRotatef(angle * (180 / Math.PI), 0, 0, 1);
            r.DrawRectangleLines(0, -this.thickness / 2, distance, this.thickness, clr('steel',7, 65 ));
            r.rlPopMatrix();
            // draw doodads
            r.DrawCircleV(this.startPoint, 4, clr('blue', 5));
            r.DrawCircleV(this.endPoint, 4, clr('blue', 5));
        }
    }
}
