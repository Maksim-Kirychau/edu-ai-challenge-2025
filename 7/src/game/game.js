import { Player } from '../models/player.js';
import { CPUStrategy } from './cpuStrategy.js';

export class Game {
  constructor() {
    this.player = new Player('Player');
    this.cpu = new Player('CPU');
    this.cpuStrategy = new CPUStrategy();
  }

  initialize() {
    this.player.placeShipsRandomly();
    this.cpu.placeShipsRandomly();
  }

  processPlayerGuess(location) {
    const result = this.cpu.board.receiveAttack(location);
    if (result.hit && this.cpu.board.getShipsRemaining() === 0) {
      return { gameOver: true, winner: 'player' };
    }
    return { gameOver: false, result };
  }

  processCPUTurn() {
    const guess = this.cpuStrategy.getNextGuess();
    const result = this.player.board.receiveAttack(guess);
    
    if (result.hit) {
      this.cpuStrategy.processHit(guess);
      if (this.player.board.getShipsRemaining() === 0) {
        return { gameOver: true, winner: 'cpu', guess, result };
      }
    }
    
    return { gameOver: false, guess, result };
  }

  getBoards() {
    return {
      playerBoard: this.player.board.grid,
      cpuBoard: this.cpu.board.grid
    };
  }
}