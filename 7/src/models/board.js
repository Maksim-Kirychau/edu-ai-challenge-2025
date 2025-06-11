import { BOARD_SIZE } from '../utils/constants.js';

export class Board {
  constructor() {
    this.grid = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill('~'));
    this.ships = [];
  }

  placeShip(ship, locations) {
    // Validate locations
    for (const loc of locations) {
      const [row, col] = this.parseLocation(loc);
      if (!this.isValidPosition(row, col)) {
        throw new Error('Invalid ship position');
      }
      if (this.grid[row][col] !== '~') {
        throw new Error('Position already occupied');
      }
    }
    // Now check adjacency for all locations (excluding the ship's own cells)
    for (const loc of locations) {
      const [row, col] = this.parseLocation(loc);
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const r = row + dr;
          const c = col + dc;
          // Only check cells not part of this ship
          if (
            this.isValidPosition(r, c) &&
            this.grid[r][c] === 'S' &&
            !locations.includes(`${r}${c}`)
          ) {
            throw new Error('Ship cannot be placed adjacent to another ship');
          }
        }
      }
    }

    // Place ship
    ship.place(locations);
    this.ships.push(ship);
    
    // Update grid
    for (const loc of locations) {
      const [row, col] = this.parseLocation(loc);
      this.grid[row][col] = 'S';
    }
  }

  isAdjacentOccupied(row, col) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const r = row + dr;
        const c = col + dc;
        if (this.isValidPosition(r, c) && this.grid[r][c] === 'S') {
          return true;
        }
      }
    }
    return false;
  }

  receiveAttack(location) {
    const [row, col] = this.parseLocation(location);
    if (!this.isValidPosition(row, col)) {
      throw new Error('Invalid attack position');
    }

    if (this.grid[row][col] === 'X' || this.grid[row][col] === 'O') {
      return { hit: false, alreadyGuessed: true };
    }

    const hit = this.ships.some(ship => ship.hit(location));
    this.grid[row][col] = hit ? 'X' : 'O';
    
    return { hit, alreadyGuessed: false };
  }

  parseLocation(location) {
    return [parseInt(location[0]), parseInt(location[1])];
  }

  isValidPosition(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  getShipsRemaining() {
    return this.ships.filter(ship => !ship.isSunk()).length;
  }

  getTotalShips() {
    return this.ships.length;
  }

  getShipCounts() {
    const counts = {};
    this.ships.forEach(ship => {
      counts[ship.length] = (counts[ship.length] || 0) + 1;
    });
    return counts;
  }
}