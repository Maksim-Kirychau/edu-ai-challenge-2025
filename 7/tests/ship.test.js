import { Ship } from '@/models/ship.js';

describe('Ship', () => {
  let ship;

  beforeEach(() => {
    ship = new Ship(3);
  });

  test('should create a ship with correct length', () => {
    expect(ship.length).toBe(3);
    expect(ship.hits).toHaveLength(3);
  });

  test('should place ship correctly', () => {
    const locations = ['00', '01', '02'];
    ship.place(locations);
    expect(ship.locations).toEqual(locations);
  });

  test('should handle hits correctly', () => {
    ship.place(['00', '01', '02']);
    expect(ship.hit('00')).toBe(true);
    expect(ship.hit('00')).toBe(false);
    expect(ship.hits[0]).toBe('hit');
  });

  test('should detect when ship is sunk', () => {
    ship.place(['00', '01', '02']);
    expect(ship.isSunk()).toBe(false);
    ship.hit('00');
    ship.hit('01');
    ship.hit('02');
    expect(ship.isSunk()).toBe(true);
  });
});