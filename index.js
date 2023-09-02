/////////////////////////////////////////////////////////////////////////////
// SLIME GAME 
/////////////////////////////////////////////////////////////////////////////

import pkg from 'raylib';
const r = pkg;

import {GLOBALS} from './globals.js';
import {clr, getColor} from './Utilities/color.js';
import {oob} from './Utilities/helpers.js';
import {
  checkCollision, 
  reflect, 
  reflectAngle,
  eatBacteria, 
  logCollision, 
  shrinkPlayer, 
  spikeAttack, 
  hunterSeek, 
  slimeAvoid
} from './Utilities/collision.js';
import {slimeArray, bacteriaArray, auraArray, genBacteria, genSlime} from './Utilities/generators.js';
import {Player} from "./Entities/player.js";

import {RadialFlagella, Ciliate} from "./Entities/Graphics/radialflagella.js";
import {RadialSpikes} from "./Entities/Graphics/radialspikes.js";
import {RadialGlobs} from "./Entities/Graphics/radialglobs.js";
import {TripleTail} from "./Entities/Graphics/tripletail.js";

import {ColorTest} from "./Entities/Graphics/template.js";

r.SetTargetFPS(60);
r.InitWindow(GLOBALS.screen.width, GLOBALS.screen.height, 'Munch');  

// game states: play, win, lose, etc.
let gameState = 'play';
let gameStateFontSize = 30; // text size for win/lose states 
let winText = 'Congrats, you are King Slime';
let loseText = 'Not Cut Out for the Slime Life';
let winTextWidth = r.MeasureText(winText, gameStateFontSize);
let loseTextWidth = r.MeasureText(loseText, gameStateFontSize);

// entities
let player = new Player();

// create the initial bacteria 
while(bacteriaArray.length < GLOBALS.game.bacteriaNum){
  genBacteria();
}

// create starting slimes
// while(slimeArray.length < GLOBALS.game.slimeNum){
//   genSlime();
// }

// graphics tests

let graphicArray = [];
let squid = new RadialFlagella({position: r.Vector2(200, 300), number: 16, length: 100, size: 40, color: getColor('blue', 75)});
graphicArray.push(squid);
let glob = new RadialGlobs({position: r.Vector2(600, 300), number: 12, size: 40, color: clr('brown', 6)});
graphicArray.push(glob);
let spike = new RadialSpikes({position: r.Vector2(800, 300), number: 14, size: 40, color: clr('red', 5)});
graphicArray.push(spike);
let tails = new TripleTail({position: r.Vector2(450, 300), length: 120, size: 30, color: clr('steel', 6)}); //position, length
graphicArray.push(tails);
// let ciliate = new Ciliate({position: r.Vector2(200, 550), number: 24, length: 100, size: 60, color: getColor('pink', 75)});
// graphicArray.push(ciliate);

// let testX = 200;
// let clrKeys = ['red', 'green', 'blue', 'pink', 'brown', 'steel'];
// for(let i = 0; i < 6; i++){
//   let colorTest = new ColorTest({position: {x: testX , y: 500}, size: 30, colorKey: clrKeys[i]});
//   graphicArray.push(colorTest);
//   testX += 100;
// }




/////////////////////////////////////////////////////////////////////////////
// Game Loop
/////////////////////////////////////////////////////////////////////////////

while (!r.WindowShouldClose()) { // Detect window close button or ESC key

  r.BeginDrawing();
  r.ClearBackground(clr('base'));

  // UPDATE BACTERIA
  bacteriaArray.forEach((bacteria, index) => {
    // split bacteria array into live/dead
    let liveBacteriaArray = bacteriaArray.filter((bacteria) => bacteria.alive);
    let deadBacteriaArray = bacteriaArray.filter((bacteria) => !bacteria.alive);
    // chance to re-spawn/regen
    if(!bacteria.active){
      let rand = r.GetRandomValue(1, 5000);
      if(rand == 5){
        // kill and re-spawn
        bacteriaArray.splice(index, 1);
        genBacteria();
      } else if(rand == 4){
        // regenerate
        bacteria.active = true;
      }
    }
    // collision with Player 
    if(player){ checkCollision(bacteria, player, [eatBacteria]); }
    // collision with slimes
    slimeArray.forEach((slime) => { 
      checkCollision(bacteria, slime, [eatBacteria]) 
    });
    // bacteria update/movement
    bacteria.update();
    // kill out of bounds (10px buffer)
    if(bacteria.active && oob(bacteria.position, 10)) { bacteriaArray.splice(index, 1) } 
    // draw
    bacteria.draw(); 
  });

  let hunterArray = slimeArray.filter((slime) => slime.type == 'hunter');

  // UPDATE AURAS
  auraArray.forEach((aura, index) => {
    // aura v player
    if(player){ checkCollision(aura, player, [hunterSeek]); }
    // aura v slimes
    slimeArray.forEach((slime) => {
      if(slime != aura.parent){ // dont check against self
        checkCollision(aura, slime, [slimeAvoid]);
      }
    });
    aura.update();
    if(!aura.parent.alive){
      auraArray.splice(index, 1);
      // console.log('Aura Num: '+auraArray.length);
      // console.log('Hunter Num: '+hunterArray.length);
    }
    aura.draw();
  })

  // GENERATE SLIMES
  if(slimeArray.length < GLOBALS.game.slimeNum){ genSlime(); }

  // UPDATE SLIMES
  slimeArray.forEach((slime, index) => {
    // check collision with player spike attack (OFF)
    // if(player){ checkCollision(slime, player.spike, [reflect, spikeAttack], player); }
    // collision with player
    if(player){ checkCollision(slime, player, [reflect, shrinkPlayer]); }
    // collision with other slimes
    slimeArray.forEach((slime2, index2) => { 
      if(index != index2){ // dont check against themselves
        checkCollision(slime, slime2, [reflect, reflectAngle]);
      }; 
    });
    // slime update/movement
    slime.update();
    // kill out of bounds (120px buffer) 
    if(oob(slime.position, 120)) { 
      // remove slime itself
      slime.alive = false;
      slimeArray.splice(index, 1);
    }
    // draw
    slime.draw();
  });


  // Game State & Player 
  if(player.size <= 5){
    gameState = 'lose';
  } else if(player.size >= GLOBALS.game.maxSize){
    gameState = 'win';
  }

  if(gameState == 'play'){
    // player update/movement
    player.update();
    // draw player 
    player.draw();
    // debug
    // r.DrawText('Player Size: ' + player.size + '/'+GLOBALS.game.maxSize, 20, 20, 30, clr('steel', 6));
    // r.DrawText('Angle: ' + player.angle, 20, 60, 30, clr('steel', 6));
    // r.DrawText('MaxSpeed: ' + player.getMaxSpeed(), 20, 100, 30, clr('steel', 6));
  } else if(gameState == 'win'){ 
    // Win Screen
    player.speed.x = 0;
    player.speed.y = 0;
    r.DrawCircleV(player.position, player.size, player.color );
    r.DrawText(winText, (GLOBALS.screen.width/2) - (winTextWidth/2), (GLOBALS.screen.height/2), gameStateFontSize, clr('steel', 6));
  } else if(gameState == 'lose'){
    // Lose Screen
    player = false; 
    r.DrawText(loseText, (GLOBALS.screen.width/2) - (loseTextWidth/2), (GLOBALS.screen.height * 0.75), gameStateFontSize, clr('steel', 6));
  } else {
    // error 
    console.log('NO GAME STATE');
  }

  
  // Graphics...
  graphicArray.forEach((graphic, index) => {
    graphic.update();
    graphic.draw();
  });
  

  // debug 
  r.DrawText('FPS: ' + r.GetFPS(), 20, 20, 30, clr('steel', 6)); 

  r.EndDrawing();

}

// De-Initialization
// --------------------------------------------------------------------------------------
r.CloseWindow() // Close window and OpenGL context
// --------------------------------------------------------------------------------------