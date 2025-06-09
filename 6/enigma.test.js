const { Enigma, Rotor, ROTORS, REFLECTOR } = require('./enigma');

describe('Enigma Machine', () => {
  test('should correctly encrypt and decrypt a message', () => {
    const enigma = new Enigma(
      [0, 1, 2], // Rotor IDs
      [0, 0, 0], // Rotor positions
      [0, 0, 0], // Ring settings
      [] // No plugboard pairs
    );
    
    const message = 'HELLO';
    const encrypted = enigma.process(message);
    
    // Reset the machine to initial state
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  test('should handle rotor stepping correctly', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      []
    );
    
    // Test first 26 characters to verify rotor stepping
    const message = 'A'.repeat(26);
    const encrypted = enigma.process(message);
    
    // Each character should be different due to rotor stepping
    const uniqueChars = new Set(encrypted.split(''));
    expect(uniqueChars.size).toBeGreaterThan(1);
  });

  test('should handle plugboard swaps correctly', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B']] // Swap A and B
    );
    
    const message = 'AB';
    const encrypted = enigma.process(message);
    
    // Reset the machine
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [0, 0, 0],
      [['A', 'B']]
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });

  test('should handle ring settings correctly', () => {
    const enigma = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [1, 1, 1], // Ring settings offset by 1
      []
    );
    
    const message = 'A';
    const encrypted = enigma.process(message);
    
    // Reset with same ring settings
    const enigma2 = new Enigma(
      [0, 1, 2],
      [0, 0, 0],
      [1, 1, 1],
      []
    );
    
    const decrypted = enigma2.process(encrypted);
    expect(decrypted).toBe(message);
  });
});
