import { BOARD_SIZE } from '../utils/constants.js';

export class CPUStrategy {
  constructor() {
    this.mode = 'hunt';
    this.targetQueue = [];
    this.guesses = new Set();
  }

  getNextGuess() {
    if (this.mode === 'target' && this.targetQueue.length > 0) {
      const guess = this.targetQueue.shift();
      if (!this.guesses.has(guess)) {
        this.guesses.add(guess);
        return guess;
      }
    }

    this.mode = 'hunt';
    let guess;
    do {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);
      guess = `${row}${col}`;
    } while (this.guesses.has(guess));

    this.guesses.add(guess);
    return guess;
  }

  processHit(location) {
    this.mode = 'target';
    const [row, col] = [parseInt(location[0]), parseInt(location[1])];
    
    const adjacent = [
      { r: row - 1, c: col },
      { r: row + 1, c: col },
      { r: row, c: col - 1 },
      { r: row, c: col + 1 }
    ];

    for (const adj of adjacent) {
      if (this.isValidPosition(adj.r, adj.c)) {
        const guess = `${adj.r}${adj.c}`;
        if (!this.guesses.has(guess) && !this.targetQueue.includes(guess)) {
          this.targetQueue.push(guess);
        }
      }
    }
  }

  processSunk() {
    this.mode = 'hunt';
    this.targetQueue = [];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }
}