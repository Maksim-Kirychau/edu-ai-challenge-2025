export class Ship {
    constructor(length) {
      this.length = length;
      this.locations = [];
      this.hits = new Array(length).fill('');
    }
  
    place(locations) {
      if (locations.length !== this.length) {
        throw new Error('Invalid number of locations for ship');
      }
      this.locations = locations;
    }
  
    hit(location) {
      const index = this.locations.indexOf(location);
      if (index === -1) return false;
      if (this.hits[index] === 'hit') return false;
      this.hits[index] = 'hit';
      return true;
    }
  
    isSunk() {
      return this.hits.every(hit => hit === 'hit');
    }
  }