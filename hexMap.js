const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const lineThickness = 3;
import {Hexagon} from "./hexagon.js";

export class HexMap {
  constructor(size) {
    this.map = [];
    constructMap(this.map,size);
  }
  
  render() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.beginPath();
    for (var i = 0; i < lineThickness; i++) {
      for (var hexagon in this.map) {
        this.map[hexagon].render();
      }
    }
  }

  getHexagon(x,y) {
    for (var hexIndex in this.map) {
      var currentHex = this.map[hexIndex];
      if (currentHex.x == x && currentHex.y == y) {
        return currentHex;
      }
    }
    return null;
  }
}

function constructMap(map,size) {
  //even to odd, x bound moves down
  //odd to even, x bound moves up
  var xOffset = Math.floor(size/2);
  var xLower = xOffset;
  var xUpper = size + xOffset;
  for (var y = 0; y < (2*size)-1; y++) {
    
    for (var x = xLower; x < xUpper; x++) {
      map.push(new Hexagon(x,y));
    }
    
    if (y < size-1) {
      if (y%2 == 0) {
         xLower -= 1;
      } else {
        xUpper += 1;
      }
    } else {
      if (y%2 == 0) {
        xUpper -= 1;
      } else {
       xLower += 1;
      }
    }
    
  }
}