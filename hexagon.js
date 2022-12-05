const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.font = "17px Arial";
const a = 2 * Math.PI / 6;
const r = 50;
import {scale,devMode} from "./script.js";
//image declarations
const coin = new Image();
coin.src = './images/coin.png';        
coin.onload = () => {ctx.drawImage(coin, 0, 0);};
const question = new Image();
question.src = './images/question.png';        
question.onload = () => {ctx.drawImage(question, 0, 0);};
const monster = new Image();
monster.src = './images/monster.png';        
monster.onload = () => {ctx.drawImage(monster, 0, 0);};
const diamond = new Image();
diamond.src = './images/diamond.png';        
diamond.onload = () => {ctx.drawImage(diamond, 0, 0);};
const treasure = new Image();
treasure.src = './images/treasure.png';        
treasure.onload = () => {ctx.drawImage(treasure, 0, 0);};

export class Hexagon {
  constructor(x,y,type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.flipped = false;
    this.highlighted = false;
    this.treasure = false;
    this.text = "";
  }
  render() {
    this.drawHexagon(r+86*(this.x+(this.y%2) * 0.5), r+76*this.y);
  }

  drawHexagon(x, y) {
    ctx.beginPath();  
    if (this.highlighted) {
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 2;
    }
    
    for (var i = 0.5; i < 6.5; i++) {
      ctx.lineTo((x + r * Math.cos(a * i))*scale, (y + r * Math.sin(a * i))*scale);
    }
    ctx.closePath();
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fill();
    ctx.fillStyle = "black"
    if (this.flipped) {
      switch (this.type) {
        case "blank":
          ctx.fillStyle = "rgb(200,200,200)";
          ctx.fill();
          ctx.fillStyle = "black"
          break;
        case "gold":
          ctx.drawImage(coin,0,0,2000,2000,(x-50)*scale,(y-53)*scale,600*scale,600*scale)
          break;
        case "chance":
          ctx.drawImage(question,0,0,2200,2200,(x-54)*scale,(y-54)*scale,473*scale,473*scale)
          break;
        case "cave monster":
          ctx.drawImage(monster,0,0,2200,2200,(x-60)*scale,(y-28)*scale,350*scale,300*scale)
          break;
        case "diamond":
          ctx.drawImage(diamond,0,0,2200,2200,(x-47)*scale,(y-40)*scale,350*scale,300*scale)
          break;
        case "exit":
          ctx.fillText("exit", (x-24) * scale, (y+9)*scale);
          break;
      }
    } else if (this.treasure) {
      ctx.drawImage(treasure,0,0,2200,2200,(x-55)*scale,(y-35)*scale,400*scale,400*scale)
    }
    ctx.stroke();
    ctx.fillStyle = "purple";
    ctx.fillText(this.text, (x-10) * scale, (y+9)*scale);
    ctx.fillStyle = "black";
    if (this.highlighted) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
    }
  }
}

