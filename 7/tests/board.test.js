import { Board } from '../src/models/board.js';
import { Ship } from '../src/models/ship.js';

describe('Board', () => {
  let board;

  beforeEach(() => {
    board = new Board();
  });

  test('should create empty board', () => {
    expect(board.grid).toHaveLength(10);
    expect(board.grid[0]).toHaveLength(10);
    expect(board.grid[0][0]).toBe('~');
  });

  test('should place ship correctly', () => {
    const ship = new Ship(3);
    const locations = ['00', '01', '02'];
    board.placeShip(ship, locations);
    expect(board.grid[0][0]).toBe('S');
    expect(board.grid[0][1]).toBe('S');
    expect(board.grid[0][2]).toBe('S');
  });

  test('should handle attacks correctly', () => {
    const ship = new Ship(3);
    board.placeShip(ship, ['00', '01', '02']);
    
    const hitResult = board.receiveAttack('00');
    expect(hitResult.hit).toBe(true);
    expect(board.grid[0][0]).toBe('X');
    
    const missResult = board.receiveAttack('11');
    expect(missResult.hit).toBe(false);
    expect(board.grid[1][1]).toBe('O');
  });

  test('should track remaining ships', () => {
    const ship1 = new Ship(3);
    const ship2 = new Ship(3);
    // Place ships far enough apart to avoid adjacency (e.g., rows 0 and 4)
    board.placeShip(ship1, ['00', '01', '02']);
    board.placeShip(ship2, ['40', '41', '42']);
    
    expect(board.getShipsRemaining()).toBe(2);
    board.receiveAttack('00');
    board.receiveAttack('01');
    board.receiveAttack('02');
    expect(board.getShipsRemaining()).toBe(1);
  });
});