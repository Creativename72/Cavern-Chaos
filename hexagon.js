const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
ctx.font = "10px Arial";
const a = 2 * Math.PI / 6;
const r = 50;
import {scale,devMode} from "./script.js";

export class Hexagon {
  constructor(x,y,type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.flipped = false;
    this.highlighted = false;
    this.text = "";
  }
  render() {
    this.drawHexagon(r+86*(this.x+(this.y%2) * 0.5), r+76*this.y);
  }

  drawHexagon(x, y) {
    ctx.beginPath();
    if (devMode) {
      ctx.fillText("" + this.x + ", " + this.y, x*scale - 21.5*scale, y*scale);  
    }
    ctx.fillText(this.text, (x-7.5) * scale, (y+4)*scale)
    if (this.highlighted) {
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 2;
    }
    
    for (var i = 0.5; i < 6.5; i++) {
      ctx.lineTo((x + r * Math.cos(a * i))*scale, (y + r * Math.sin(a * i))*scale);
    }
    ctx.closePath
      ();
    ctx.stroke();
    if (this.flipped) {
      if (this.type == "blank") {
        
      }
      ctx.fill();
    }
    if (this.highlighted) {
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
    }
  }
}

