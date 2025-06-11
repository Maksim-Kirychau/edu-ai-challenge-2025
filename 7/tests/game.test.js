import { Game } from '@/game/game.js';

describe('Game', () => {
  let game;

  beforeEach(() => {
    game = new Game();
    game.initialize();
  });

  afterEach(() => {
    game = null;
  });

  test('should initialize game with boards', () => {
    const boards = game.getBoards();
    expect(boards.playerBoard).toBeDefined();
    expect(boards.cpuBoard).toBeDefined();
  });

  test('should process player guess', () => {
    const result = game.processPlayerGuess('00');
    expect(result.gameOver).toBeDefined();
    expect(result.result).toBeDefined();
  });

  test('should process CPU turn', () => {
    const result = game.processCPUTurn();
    expect(result.gameOver).toBeDefined();
    expect(result.guess).toBeDefined();
    expect(result.result).toBeDefined();
  });
});