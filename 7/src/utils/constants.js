export const BOARD_SIZE = 10;

// Ship configurations for classic rules
export const SHIPS = [
    { size: 4, count: 1 },  // 1 ship of size 4
    { size: 3, count: 2 },  // 2 ships of size 3
    { size: 2, count: 3 },  // 3 ships of size 2
    { size: 1, count: 4 }   // 4 ships of size 1
];

// Total number of ships
export const NUM_SHIPS = SHIPS.reduce((total, ship) => total + ship.count, 0);