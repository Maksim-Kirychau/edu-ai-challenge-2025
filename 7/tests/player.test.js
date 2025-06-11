import { Player } from '../src/models/player.js';
import { SHIPS, BOARD_SIZE } from '../src/utils/constants.js';

describe('Player', () => {
  let player;

  beforeEach(() => {
    player = new Player('TestPlayer');
  });

  test('should create player with empty board', () => {
    expect(player.name).toBe('TestPlayer');
    expect(player.board.ships).toHaveLength(0);
    expect(player.guesses.size).toBe(0);
  });

  test('should place ships randomly according to classic rules', () => {
    player.placeShipsRandomly();
    
    // Check total number of ships
    const totalShips = SHIPS.reduce((sum, s) => sum + s.count, 0);
    expect(player.board.getTotalShips()).toBe(totalShips);
    
    // Check ship sizes
    const shipCounts = player.board.getShipCounts();
    for (const { size, count } of SHIPS) {
      expect(shipCounts[size]).toBe(count);
    }
  });

  test('should not allow ships to be placed adjacent to each other', () => {
    player.placeShipsRandomly();
    const grid = player.board.grid;

    // Helper to check if a cell is part of the same ship
    function isSameShip(i, j, si, sj, ships) {
      for (const ship of ships) {
        const locations = ship.locations || [];
        if (locations.some(loc => {
          const [row, col] = [parseInt(loc[0]), parseInt(loc[1])];
          return row === i && col === j;
        })) {
          return locations.some(loc => {
            const [row, col] = [parseInt(loc[0]), parseInt(loc[1])];
            return row === si && col === sj;
          });
        }
      }
      return false;
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (grid[i][j] === 'S') {
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              if (di === 0 && dj === 0) continue;
              const ni = i + di;
              const nj = j + dj;
              if (
                ni >= 0 && ni < BOARD_SIZE &&
                nj >= 0 && nj < BOARD_SIZE &&
                grid[ni][nj] === 'S' &&
                !isSameShip(i, j, ni, nj, player.board.ships)
              ) {
                throw new Error(`Ships at (${i},${j}) and (${ni},${nj}) are adjacent!`);
              }
            }
          }
        }
      }
    }
  });

  test('should handle guesses correctly', () => {
    const result = player.makeGuess('00');
    expect(result.alreadyGuessed).toBe(false);
    expect(player.guesses.has('00')).toBe(true);
  });

  test('should not allow duplicate guesses', () => {
    player.makeGuess('00');
    const result = player.makeGuess('00');
    expect(result.alreadyGuessed).toBe(true);
  });
});