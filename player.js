const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const a = 2 * Math.PI / 6;
const r = 50;
import {scale, board} from "./script.js";
var mouseX;
var mouseY;
export class Player {
  constructor(x,y,color,parent) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.gold = 0;
    this.movesLeft = 0;
    this.parent = parent;
  }

  render() {
    drawCircleImproved(this.x,this.y,this.color)
  }

  getMoves() {
    this.moveList = [];
    if (this.y % 2 == 0) {
      this.moveList.push(board.getHexagon(this.x - 1,this.y - 1)); //up-left
      this.moveList.push(board.getHexagon(this.x - 1,this.y)); //left
      this.moveList.push(board.getHexagon(this.x - 1,this.y + 1)); //down-left
      this.moveList.push(board.getHexagon(this.x,this.y + 1)); //down-right
      this.moveList.push(board.getHexagon(this.x + 1,this.y)); //right
      this.moveList.push(board.getHexagon(this.x,this.y - 1)); //up-right
    } else {
      this.moveList.push(board.getHexagon(this.x,this.y - 1)); //up-left
      this.moveList.push(board.getHexagon(this.x - 1,this.y)); //left
      this.moveList.push(board.getHexagon(this.x,this.y + 1)); //down-left
      this.moveList.push(board.getHexagon(this.x + 1,this.y + 1)); //down-right
      this.moveList.push(board.getHexagon(this.x + 1,this.y)); //right
      this.moveList.push(board.getHexagon(this.x + 1,this.y - 1)); //up-right
    }
    this.highlightMoves();
  }
  
  highlightMoves() {
    for (var hexIndex in this.moveList) {
      if (this.moveList[hexIndex]) {
        this.moveList[hexIndex].highlighted = true;
        this.moveList[hexIndex].text = parseInt(hexIndex) + 1;
      }
    }
  }

  unhighlightMoves() {
    for (var hexIndex in this.moveList) {
      if (this.moveList[hexIndex]) {
        this.moveList[hexIndex].highlighted = false;
        this.moveList[hexIndex].text = "";
      }
    }
  }
  
  move(num) {
    if (!this.moveList[num-1]) {
      return;
    }
    this.movesLeft -= 1;
    var h = this.moveList[num-1];
    this.x = h.x;
    this.y = h.y;
    this.unhighlightMoves();
    if (this.movesLeft == 0) {
      this.parent.endTurn();
      this.unhighlightMoves();
      return
    }
    this.getMoves();
  }

  rollMoves() {
    this.movesLeft = Math.floor(Math.random() * 4) + 1;
  }
}

function drawCircleImproved(x,y,color) {
  drawCircle(r+86*(x+(y%2) * 0.5), r+76*y,color);
}

function drawCircle(x, y, color) {
  ctx.beginPath();
  ctx.arc(x*scale, y*scale, 25*scale, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.fillStyle = "black";
}