# Enigma Machine Bug Fix Documentation

## Bug Description

The original implementation had an incorrect rotor stepping mechanism that didn't follow the proper Enigma machine rules. The main issues were:

1. **Incorrect Notch Checking**: The code was checking for notches after the rotor had already stepped, which is incorrect. Notches should be checked before stepping.

2. **Missing Double-Stepping**: The Enigma machine has a special double-stepping mechanism where the middle rotor steps twice in certain conditions. This was not implemented correctly.

3. **Incorrect Stepping Order**: The order of rotor stepping was incorrect, which led to improper encryption/decryption.

## Fix Implementation

The fix involved rewriting the `stepRotors` method to properly implement the Enigma machine's stepping rules:

1. Check if the middle rotor is at its notch position
2. Check if the right rotor is at its notch position
3. If the middle rotor is at its notch, step both the left and middle rotors
4. If the right rotor is at its notch, step the middle rotor
5. Always step the right rotor

The new implementation follows the correct Enigma machine stepping rules:
- The right rotor steps on every keypress
- The middle rotor steps when the right rotor is at its notch
- The left rotor steps when the middle rotor is at its notch
- The middle rotor steps again when the right rotor is at its notch (double-stepping)
