const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const a = 2 * Math.PI / 6;
const r = 50;
import {scale, board, renderScreen} from "./script.js";
var mouseX;
var mouseY;
//diamond image
const diamond = new Image();
diamond.src = './images/diamond.png';        
diamond.onload = () => {ctx.drawImage(diamond, 0, 0);};

export class Player {
  constructor(x,y,color,parent) {
    //coords
    this.x = x;
    this.y = y;
    //other stuff
    this.color = color;
    this.gold = 5;
    this.movesLeft = 0;
    this.parent = parent;
    //equips
    this.jackhammer = 0;
    this.dynamite = 0;
    this.dynamited = false;
    this.pickaxe = 0;
    this.excalibur = 0;
    this.helmet = 0;
    //dimund
    this.hasDiamond = false;
  }

  render() {
    drawCircleImproved(this.x,this.y,this.color,this.hasDiamond)
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
    if (this.movesLeft > 0) {
      for (var p in this.parent.players) {
        if (p != this.parent.turn) {
          if (this.parent.players[p].x == this.x && this.parent.players[p].y == this.y) {
            if (this.parent.players[p].hasDiamond) {
              var ans = window.prompt("Would you like to use a move to steal the diamond from player " + this.parent.turn + "? (y/n)")
              if (ans == "y") {
                this.movesLeft -= 1;
                this.parent.players[p].hasDiamond = false;
                this.hasDiamond = true;
              }
            }
          }
        }
      }
    }
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
    if (board.getHexagon(this.x,this.y).type == "gold") {
      board.getHexagon(this.x,this.y).type = "blank";
    }
    var h = this.moveList[num-1];
    this.parent.displayCurrentGold();
    this.parent.displayCurrentTile();
    this.x = h.x;
    this.y = h.y;
    h.flipped = true;
    this.unhighlightMoves();
    this.render()
    if (h.type == "gold") {
      if (this.pickaxe > 0) {
        this.pickaxe -= 1;
        this.gold += 3
        window.alert("Your pickaxe triples the amount of gold you gain!")
      } else {
        this.gold += 1;
      }
    } else if (h.type == "chance") {
      this.chance()
    } else if (h.type == "cave monster") {
      this.cave()
    } else if (h.type == "diamond") {
      this.diamond()
    } else if (h.type == "exit") {
      this.exit()
    }
    if (this.movesLeft > 0) {
      for (var p in this.parent.players) {
        if (p != this.parent.turn) {
          if (this.parent.players[p].x == this.x && this.parent.players[p].y == this.y) {
            if (this.parent.players[p].hasDiamond) {
              var ans = window.prompt("Would you like to use a move to steal the diamond from player " + this.parent.turn + "? (y/n)")
              if (ans == "y") {
                this.movesLeft -= 1;
                this.parent.players[p].hasDiamond = false;
                this.hasDiamond = true;
              }
            }
          }
        }
      }
    }
    if (this.movesLeft <= 0) {
      this.parent.endTurn();
      this.unhighlightMoves();
      return
    }
    this.getMoves();
  }

  rollMoves() {
    if (!this.hasDiamond) {
      this.movesLeft = Math.floor(Math.random() * 6) + 1;
    } else {
      this.movesLeft = Math.floor(Math.random() * 4) + 1;
    }
  }

  getCurrentHex() {
    return board.getHexagon(this.x,this.y);
  }

  chance() {
    var rand = Math.floor(Math.random() * 9)
    window.alert("You've landed on a chance tile!")
    switch (rand) {
      case 0:
        window.alert("Jackpot!, you found a pot of gold! (+3 gold)")
        this.gold += 3;
        this.parent.displayCurrentGold();
        break;
      case 1:
        window.alert("You got caught in a sticky cobweb, lose two moves. :(")
        this.movesLeft -= 2;
        if (this.movesLeft < 0) {
          this.movesLeft = 0;
        }
        break;
      case 2:
        window.alert("You find yourself in a goblin camp, along an old railroad line. For 3 gold, they will take you 6 tiles forward. However, if you do not pay them you must spend the rest of the turn at the goblin camp");
        var ans = window.prompt("Pay the goblins? (y/n)")
        while (ans.substring(0,1) != "y" && ans.substring(0,1) != "n") {
          window.alert("Invalid input");
          ans = window.prompt("Pay the goblins? (y/n)");
        }
        if (ans.substring(0,1) == "y" && this.gold >=3) {
          window.alert("You pay the goblins.")
          window.alert("+6 moves!")
          this.movesLeft += 6;
        } else if (ans.substring(0,1) == "y" && this.gold < 3) {
          window.alert("You do not have enough money to pay the goblins. :(")
          window.alert("Lose a turn.")
          this.movesLeft = 0;
        } else {
          window.alert("You do not pay the goblins.")
          window.alert("Lose a turn.")
          this.movesLeft = 0;
        }
        break;
      case 3:
        window.alert("Turns out some of your gold was actually fool's gold. Lose half your gold (rounding down)!")
        this.gold /= 2;
        this.gold = Math.floor(this.gold);
        break;
      case 4:
        window.alert("You found a gold mine! Double your gold.")
        this.gold *= 2;
        break;
      case 5:
        window.alert("There is already a naturally formed cave here. Gain two moves!")
        this.movesLeft += 2;
        break;
      case 6:
        window.alert("Cave in! You are stuck and have to dig yourself out. Lose the rest of your turn.")
        this.movesLeft = 0;
        break;
      case 7:
        if (this.excalibur == 0) {
          window.alert("Bat attack!, you must roll a 3 or higher to escape.")
        } else {
          window.alert("Bat attack!, due to the powers of excalibur you must roll a 2 or higher to escape.")
        }
        var rand = Math.floor(Math.random() * 6) + 1;
        window.alert("You rolled a " + rand + ".")
        if (rand >= 3 || (this.excalibur >= 1 && rand >=2) ) {
          window.alert("You manage to fend off the bats.")
        } else {
          window.alert("You barely manage to fight off the bats, rest here for the remainder of your turn.")
          this.movesLeft = 0;
        }
        break;
      case 8:
        window.alert("Trade in: You come upon an ancient vending machine. The payment required is a piece of equipment, and you can choose which piece of equipment to get in return.")
        var ans = window.prompt("Would you like to use it? (y/n)")
        var substr = ans.substring(0,1).toLowerCase()
        while (!(substr == "y" || substr == "n")) {
          window.alert("Invalid input")
          ans = window.prompt("Would you like to use it? (y/n)")
          substr = ans.substring(0,1).toLowerCase()
        }
        ans = ans.substring(0,1).toLowerCase()
        if (ans == "y") {
          var questionString = "Which would you like to trade?"
          if (this.jackhammer > 0) {
            questionString += "\n[J]ackhammer (You have " + this.jackhammer + " left.)"
          }
          if (this.pickaxe > 0) {
            questionString += "\n[P]ickaxe (You have " + this.pickaxe + " left.)"
          }
          if (this.excalibur > 0) {
            questionString += "\n[E]xcalibur (You have " + this.excalibur + " left.)"
          }
          if (this.helmet > 0) {
            questionString += "\n[H]elmet (You have " + this.helmet + " left.)"
          }
          if (this.jackhammer == 0 && this.pickaxe == 0 && this.excalibur == 0 && this.helmet == 0) {
          window.alert("You don't have any equipment to trade!")
          break;
        }
          ans = window.prompt(questionString)
          ans = ans.substring(0,1).toLowerCase();
          if (ans == "j") {
            this.jackhammer -= 1;
          } else if (ans == "p") {
            this.pickaxe -= 1;
          } else if (ans == "e") {
            this.excalibur -= 1;
          } else if (ans == "h") {
            this.helmet -= 1;
          } else {
            window.alert("The ancient vending machine flickers, says invalid input and crashes. Its programmers must have not accounted for putting in an incorrect input.")
            break;
          }
          ans = window.prompt("Which would you like to recieve? \n[J]ackhammer \n[P]ickaxe \n[E]xcalibur \n[H]elmet").substring(0,1).toLowerCase()
          if (ans == "j") {
            this.jackhammer += 1;
          } else if (ans == "p") {
            this.pickaxe += 1;
          } else if (ans == "e") {
            this.excalibur += 1;
          } else if (ans == "h") {
            this.helmet += 1;
          } else {
            window.alert("The ancient vending machine flickers, says invalid input and crashes. Its programmers must have not accounted for putting in an incorrect input.")
          }
        }
        break;
    }
  }

  cave() {
    window.alert("OH NO!, YOU'VE RUN INTO A CAVE MONSTER!")
    if (this.excalibur == 0) {
      window.alert("You must roll a 6 sided die to defeat this legendary monster. If you roll a 5 or 6 you can escape unscathed.")
    } else {
      window.alert("You must roll a 6 sided die to defeat this legendary monster. Due to the powers of the legendary sword excalibur you can escape unscathed if you roll a 3 or above.")
    }
    var rand = Math.floor(Math.random() * 6) + 1;
    window.alert("You rolled a " + rand + ".")
    if (rand >= 5 || (this.excalibur >= 1 && rand >=3) ) {
      window.alert("You manage to slay the legendary beast and steal its vaste hoard.")
      window.alert("+10 gold")
      this.gold += 10;
    } else {
      window.alert("The vicious beast makes quick work of you and steals all of your possessions. Lose a turn, all of your gold, and your equipment.")
      this.gold = 0;
      this.movesLeft = 0;
      this.jackhammer = 0;
      this.dynamite = 0;
      this.pickaxe = 0;
      this.excalibur = 0;
      this.helmet = 0;
    }
  }

  diamond() {
    window.alert("You have landed on the diamond!")
    var ans = window.prompt("Would you like to pick it up? (y/n)")
    if (ans == "y") {
      this.hasDiamond = true;
      this.getCurrentHex().type = "blank";
    }
  }

  exit() {
    if (this.hasDiamond) {
      window.alert("you win!")
    }
  }
}

function drawCircleImproved(x,y,color,hasD) {
  drawCircle(r+86*(x+(y%2) * 0.5), r+76*y,color,hasD);
}

function drawCircle(x, y, color,hasD) {
  ctx.beginPath();
  ctx.arc(x*scale, y*scale, 25*scale, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.lineWidth = 1;
  ctx.fillStyle = "black";
  if (hasD) {
    ctx.drawImage(diamond,0,0,2200,2200,(x-47)*scale,(y-40)*scale,350*scale,300*scale)
  }
}