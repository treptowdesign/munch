import {hexToRGB} from './helpers.js';

const base = '#150a1f';
const white = '#ffffff';
const colors = {
    'red': {
        0: base, 1: '#280b26', 2: '#361027', 3: '#681824', 
        4: '#b42313', 5: '#f4680b', 6: '#f4c047', 7: white
    },
    'green': {
        0: base, 1: '#0c1327', 2: '#03282b', 3: '#09493f',
        4: '#118337', 5: '#57c52b', 6: '#b9ed5e', 7: white
    },
    'pink': {
        0: base, 1: '#1a112e', 2: '#291945', 3: '#5e1c5a',
        4: '#8f1767', 5: '#f45d92', 6: '#feb58b', 7: white
    },
    'blue': {
        0: base, 1: '#0e092f', 2: '#1b1853', 3: '#222d81',
        4: '#465be7', 5: '#2ac0f2', 6: '#7df2cf', 7: white
    },
    'brown': {
        0: base, 1: '#220c27', 2: '#2f1316', 3: '#431e1e',
        4: '#74341a', 5: '#af5d23', 6: '#f8993a', 7: white
    },
    'steel': {
        0: base, 1: '#19102e', 2: '#241e44', 3: '#25315e',
        4: '#3a5c85', 5: '#56a1bf', 6: '#97dbd2', 7: white
    }
}

export function clr(color, lightness, opacity){
    let colorHex;
    if(color == 'base'){
        colorHex = base;
    } else if(color == 'white'){
        colorHex = white;
    } else {
        colorHex = colors[color][ lightness || 4];
    }
    let alpha = opacity ? ((opacity / 100) * 255) : 255;
    return hexToRGB(colorHex, alpha);
}