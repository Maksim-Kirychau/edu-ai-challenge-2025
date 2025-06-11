import { Game } from './game.js';

class GameUI {
    constructor() {
        this.game = new Game();
        this.game.initialize();
        this.playerBoard = document.getElementById('playerBoard');
        this.cpuBoard = document.getElementById('cpuBoard');
        this.status = document.getElementById('status');
        this.setupBoards();
        this.updateStatus('Your turn! Click on the CPU board to make a guess.');
    }

    setupBoards() {
        // Create player board
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                this.playerBoard.appendChild(cell);
            }
        }

        // Create CPU board
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.handlePlayerGuess(i, j));
                this.cpuBoard.appendChild(cell);
            }
        }

        this.updateBoards();
    }

    updateBoards() {
        // Update player board
        const playerGrid = this.game.getBoards().playerBoard;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = this.playerBoard.children[i * 10 + j];
                cell.textContent = playerGrid[i][j];
                cell.className = 'cell';
                if (playerGrid[i][j] === 'X') cell.classList.add('hit');
                if (playerGrid[i][j] === 'O') cell.classList.add('miss');
                if (playerGrid[i][j] === 'S') cell.classList.add('ship');
            }
        }

        // Update CPU board
        const cpuGrid = this.game.getBoards().cpuBoard;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const cell = this.cpuBoard.children[i * 10 + j];
                cell.textContent = cpuGrid[i][j] === 'S' ? '~' : cpuGrid[i][j];
                cell.className = 'cell';
                if (cpuGrid[i][j] === 'X') cell.classList.add('hit');
                if (cpuGrid[i][j] === 'O') cell.classList.add('miss');
            }
        }
    }

    handlePlayerGuess(row, col) {
        const location = `${row}${col}`;
        const result = this.game.processPlayerGuess(location);
        
        if (result.gameOver) {
            this.updateStatus('You won!');
            this.disableBoard();
            return;
        }

        this.updateBoards();
        this.updateStatus(result.result.hit ? 'Hit! CPU\'s turn...' : 'Miss! CPU\'s turn...');

        // CPU turn
        setTimeout(() => {
            const cpuResult = this.game.processCPUTurn();
            this.updateBoards();
            
            if (cpuResult.gameOver) {
                this.updateStatus('CPU won!');
                this.disableBoard();
                return;
            }

            this.updateStatus(cpuResult.result.hit ? 'CPU hit your ship!' : 'CPU missed! Your turn.');
        }, 1000);
    }

    updateStatus(message) {
        this.status.textContent = message;
    }

    disableBoard() {
        const cells = this.cpuBoard.getElementsByClassName('cell');
        for (let cell of cells) {
            cell.style.pointerEvents = 'none';
        }
    }
}

// Initialize the game
new GameUI();
