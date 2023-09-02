import pkg from 'raylib';
const r = pkg;

import {clr, getColor} from '../../Utilities/color.js';
import {matrixRotate, rotatePoint, degreesToRadians, radiansToDegrees, getVector} from '../../Utilities/helpers.js';

import { LineWave } from './linewave.js';
import { Glob } from './glob.js';
import { Spike } from './spike.js';

export class ColorTest {
    constructor({position = r.Vector2(0, 0), size = 40, colorKey = 'red'} = {}) {
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

export class GraphicTemplate {
    constructor({position = r.Vector2(0, 0), size = 40, color = clr('white', 7)} = {}) {
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