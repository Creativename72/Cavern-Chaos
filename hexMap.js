const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const lineThickness = 3;
import {Hexagon} from "./hexagon.js";

export class HexMap {
  constructor(size) {
    this.map = [];
    constructMap(this.map,size);
    var yList = [3,5,7,9,11];
    var rand = Math.floor(Math.random() * 5);
    for (var i in yList) {
      this.getHexagon(7,yList[i]).treasure = false; //change to true to bring back treasure chests
    }
    this.getHexagon(7,yList[rand]).type = "diamond";
    this.getHexagon(0,7).type = "exit";
    this.getHexagon(0,7).flipped = true;
    this.getHexagon(14,7).type = "exit";
    this.getHexagon(14,7).flipped = true;
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
      var type = "";
      //probabilities
      var b = 20;
      var cm = 2;
      var ch = 10;
      var g = 10;
      var rand = Math.floor(Math.random()*(b+cm+ch+g));
      if (rand < b) {
        type = "blank"
      } else if (rand < b + cm) {
        type = "cave monster"
      } else if (rand < b + cm + ch) {
        type = "chance"
      } else {
        type = "gold"
      }
      //console.log(type)
      map.push(new Hexagon(x,y,type));
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