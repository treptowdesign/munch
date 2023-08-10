/////////////////////////////////////////////////////////////////////////////
// SLIME GAME 
/////////////////////////////////////////////////////////////////////////////

import pkg from 'raylib';
const r = pkg;

import {GLOBALS} from './globals.js';
import {clr} from './Utilities/color.js';
import {oob} from './Utilities/helpers.js';
import {
  checkCollision, 
  reflect, 
  eatBacteria, 
  logCollision, 
  shrinkPlayer, 
  spikeAttack, 
  hunterSeek, 
  slimeAvoid} from './Utilities/collision.js';
import {slimeArray, bacteriaArray, auraArray, genBacteria, genSlime} from './Utilities/generators.js';
import {Player} from "./Entities/player.js";
import {RadialFlagella, RadialGlobs, RadialSpikes, TripleTail, Glob, Spike} from "./Entities/graphics.js";

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
let squid = new RadialFlagella({x: 200 , y: 300}, 16, 100, 40); //position, number, length, size
graphicArray.push(squid);
let tails = new TripleTail({x: 450 , y: 300}, 120); //position, size
graphicArray.push(tails);
let glob = new RadialGlobs({x: 600 , y: 300}, 10, 40); //position, number, size
graphicArray.push(glob);
let spike = new RadialSpikes({x: 200 , y: 500}, 14, 40, clr('red', 5)); //position, number, size, color
graphicArray.push(spike);



/////////////////////////////////////////////////////////////////////////////
// Game Loop
/////////////////////////////////////////////////////////////////////////////

while (!r.WindowShouldClose()) { // Detect window close button or ESC key

  r.BeginDrawing();
  r.ClearBackground(clr('base'));

  // UPDATE BACTERIA
  bacteriaArray.forEach((bacteria, index) => {
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
      console.log('Aura Num: '+auraArray.length);
      console.log('Hunter Num: '+hunterArray.length);
    }
    aura.draw();
  })

  // GENERATE SLIMES
  if(slimeArray.length < GLOBALS.game.slimeNum){ genSlime(); }

  // UPDATE SLIMES
  slimeArray.forEach((slime, index) => {
    // check collision with player spike attack
    if(player){ checkCollision(slime, player.spike, [reflect, spikeAttack], player); }
    // collision with player
    if(player){ checkCollision(slime, player, [reflect, shrinkPlayer]); }
    // collision with other slimes
    slimeArray.forEach((slime2, index2) => { 
      if(index != index2){ // dont check against themselves
        checkCollision(slime, slime2, [reflect]);
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
    r.DrawText('Angle: ' + player.angle, 20, 60, 30, clr('steel', 6));
    r.DrawText('MaxSpeed: ' + player.getMaxSpeed(), 20, 100, 30, clr('steel', 6));
  } else if(gameState == 'win'){ 
    // Win Screen
    player.speed.x = 0;
    player.speed.y = 0;
    r.DrawCircleV(player.position, player.size, player.color );
    r.DrawText(winText, (GLOBALS.screen.width/2) - (winTextWidth/2), (GLOBALS.screen.height/2), gameStateFontSize, clr('steel', 6));
  } else if(gameState == 'lose'){
    // Lose Screen
    player = false; 
    r.DrawText(loseText, (GLOBALS.screen.width/2) - (loseTextWidth/2), (GLOBALS.screen.height/2), gameStateFontSize, clr('steel', 6));
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