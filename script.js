//imports
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
import {Hexagon} from "./hexagon.js";
import {HexMap} from "./hexMap.js";
import {Player} from "./player.js";
import {System} from "./system.js"
//math constants
const lineThickness = 3;
export const scale = 0.45;
export const devMode = false;
//creates board
export var board = new HexMap(10);
export var gameSys = new System();
gameSys.startTurn();
function renderScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.render()
  for (var player in gameSys.players) {
    gameSys.players[player].render()
  }
}

setInterval(renderScreen,100);