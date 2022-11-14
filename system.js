import {gameSys} from "./script.js";
import {Player} from "./player.js";
//system class handles player objects and turn structure
//general game flow and structure
export class System {
  constructor() {
    this.players = [new Player(5,0,"rgba(0, 0, 255, 0.4)",this),new Player(14,0,"rgba(0, 255, 0, 0.4)",this),new Player(5,18,"rgba(255, 0, 0, 0.4)",this),new Player(10,11,"rgba(255, 255, 0, 0.4)",this)];
    this.turn = 0;
  }
  startTurn() {
    var currentPlayer = this.players[this.turn]
    currentPlayer.getMoves();
    currentPlayer.rollMoves();
  }
  endTurn() {
    this.turn += 1;
    this.turn %= 4;
    this.startTurn();
  }
}
//reads for movement input
document.addEventListener('keyup', (e) => {
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
    break
  }
});