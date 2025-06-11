import { Board } from './board.js';
import { Ship } from './ship.js';
import { SHIPS, BOARD_SIZE } from '../utils/constants.js';

export class Player {
  constructor(name) {
    this.name = name;
    this.board = new Board();
    this.guesses = new Set();
  }

  placeShipsRandomly() {
    // Clear any existing ships
    this.board.ships = [];
    this.board.grid = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill('~'));

    // Place ships in order from largest to smallest
    const sortedShips = [...SHIPS].sort((a, b) => b.size - a.size);
    
    for (const shipConfig of sortedShips) {
      for (let i = 0; i < shipConfig.count; i++) {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 1000; // Increased max attempts

        while (!placed && attempts < maxAttempts) {
          try {
            const ship = new Ship(shipConfig.size);
            const locations = this.generateRandomShipLocations(shipConfig.size);
            this.board.placeShip(ship, locations);
            placed = true;
          } catch (error) {
            attempts++;
          }
        }

        if (!placed) {
          throw new Error(`Failed to place ship of size ${shipConfig.size} after ${maxAttempts} attempts`);
        }
      }
    }

    // Verify ship placement
    this.verifyShipPlacement();
  }

  verifyShipPlacement() {
    const totalShips = SHIPS.reduce((sum, s) => sum + s.count, 0);
    if (this.board.getTotalShips() !== totalShips) {
      throw new Error(`Incorrect number of ships placed. Expected ${totalShips}, got ${this.board.getTotalShips()}`);
    }

    const shipCounts = this.board.getShipCounts();
    for (const { size, count } of SHIPS) {
      if (shipCounts[size] !== count) {
        throw new Error(`Incorrect number of ships of size ${size}. Expected ${count}, got ${shipCounts[size] || 0}`);
      }
    }
  }

  generateRandomShipLocations(length) {
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
    const locations = [];

    if (orientation === 'horizontal') {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const startCol = Math.floor(Math.random() * (BOARD_SIZE - length + 1));
      for (let i = 0; i < length; i++) {
        locations.push(`${row}${startCol + i}`);
      }
    } else {
      const col = Math.floor(Math.random() * BOARD_SIZE);
      const startRow = Math.floor(Math.random() * (BOARD_SIZE - length + 1));
      for (let i = 0; i < length; i++) {
        locations.push(`${startRow + i}${col}`);
      }
    }
    return locations;
  }

  makeGuess(location) {
    if (this.guesses.has(location)) {
      return { hit: false, alreadyGuessed: true };
    }
    this.guesses.add(location);
    return this.board.receiveAttack(location);
  }
}