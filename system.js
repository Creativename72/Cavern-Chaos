import {gameSys} from "./script.js";
import {Player} from "./player.js";
//system class handles player objects and turn structure
//general game flow and structure
export class System {
  constructor() {
    //this.players = [new Player(5,0,"rgba(0, 0, 255, 0.4)",this),new Player(14,0,"rgba(0, 255, 0, 0.4)",this),new Player(5,18,"rgba(255, 0, 0, 0.4)",this),new Player(14,18,"rgba(255, 255, 0, 0.4)",this)];
    this.players = [new Player(4,0,"rgba(0,0,255,0.4",this),new Player(11,0,"rgba(0, 255, 0, 0.4)",this),new Player(4,14,"rgba(255, 0, 0, 0.4)",this),new Player(11,14,"rgba(255, 255, 0, 0.4)",this)];
    this.turn = 0;
    for (var p in this.players) {
      this.players[p].getCurrentHex().type = "blank";
      this.players[p].getCurrentHex().flipped = true;
    }
  }
  
  startTurn() {
    var currentPlayer = this.players[this.turn]
    currentPlayer.getMoves();
    window.alert("Rolling moves for player " + (this.turn + 1))
    currentPlayer.rollMoves();
    window.alert("You rolled a " + currentPlayer.movesLeft + "!")
    if (currentPlayer.jackhammer > 0) {
      var ans = window.prompt("Would you like to use a jackhammer in order to gain 1-3 moves? (y/n)")
      if (ans == "y") {
        var rand = Math.floor(Math.random() * 3) + 1
        window.alert("You gained " + rand + " moves!")
        currentPlayer.movesLeft += rand;
      }
    }
    this.updateDisplays();
  }
  
  endTurn() {
    window.alert("Your turn is over. Give control of the game to the next player.")
    this.turn += 1;
    this.turn %= 4;
    this.startTurn();
  }

  updateDisplays() {
    this.displayCurrentTile();
    this.displayCurrentPlayer();
    this.displayCurrentGold();
    this.displayEquipment();
  }

  displayCurrentTile() {
    document.getElementById("currentTile").textContent = "Current Tile: " + this.players[this.turn].getCurrentHex().type
  }

  displayCurrentPlayer() {
    document.getElementById("currentPlayer").textContent = "Current Player: " + (this.turn + 1);
  }

  displayCurrentGold() {
    document.getElementById("currentGold").textContent = "Gold:" + this.players[this.turn].gold + "\n" + "Moves Left: " + this.players[this.turn].movesLeft;
  }

  displayEquipment() {
    var str = "Equipment: Press [E] to buy" + " <br/> ";
    str += "Jackhammer uses: " + this.players[this.turn].jackhammer + " <br/> ";
    str += "Pickaxe uses: " + this.players[this.turn].pickaxe + " <br/> ";
    str += "Excalibur uses: " + this.players[this.turn].excalibur + " <br/> ";
    str += "Helmet uses: " + this.players[this.turn].helmet + " (Press [M] to use)";

    document.getElementById("equipment").innerHTML = str;
  }
}

//reads for movement input
document.addEventListener('keyup', (e) => {
  console.log(e.code)
  switch (e.code[(e.code.length) - 1]) {
    case "1":
      gameSys.players[gameSys.turn].move(1);
      break;
    case "2":
      gameSys.players[gameSys.turn].move(2);
      break;
    case "3":
      gameSys.players[gameSys.turn].move(3);
      break;
    case "4":
      gameSys.players[gameSys.turn].move(4);
      break;
    case "5":
      gameSys.players[gameSys.turn].move(5);
      break;
    case "6":
      gameSys.players[gameSys.turn].move(6);
      break;
    case "E":
      if (gameSys.players[gameSys.turn].gold < 3) {
        window.alert("You do not have enough gold to buy equipment!");
      } else {
        gameSys.players[gameSys.turn].gold -= 3;
        getEquip()
      }
      break;
    case "M":
      if (gameSys.players[gameSys.turn].helmet == 0) {
        break;
      }
      gameSys.players[gameSys.turn].helmet -= 1;
      for (var tile in gameSys.players[gameSys.turn].moveList) {
        if (gameSys.players[gameSys.turn].moveList[tile]) {
          gameSys.players[gameSys.turn].moveList[tile].flipped = true;
        }
      }
      break;
  }
});

function getEquip() {
  var rand = Math.floor(Math.random() * 4);
  //dynamite temp disabled
  switch (rand) {
    case 0:
      gameSys.players[gameSys.turn].jackhammer += 2;
      window.alert("You gained 2 uses of the jackhammer!");
      break;
    case 1:
      if (gameSys.players[gameSys.turn].excalibur >= 1) {
        getEquip()
        break;
      }
      gameSys.players[gameSys.turn].excalibur += 1;
      window.alert("You gained the legendary sword excalibur!");
      break;
    case 2:
      gameSys.players[gameSys.turn].pickaxe += 3;
      window.alert("You gained 3 uses of the pickaxe!");
      break;
    case 3:
      gameSys.players[gameSys.turn].helmet += 2;
      window.alert("You gained 2 uses of the mining helmet!");
      break;
    case 4:
      gameSys.players[gameSys.turn].dynamite += 1;
      window.alert("You gained 1 use of heat seeking dynamite!");
      break;
  }
}