const LEVELS = [
    [
        "  ####  ",
        "###  ###",
        "#  $   #",
        "#   @# #",
        "### $  #",
        "  #..###",
        "  ####  "
    ],
    [
        "  ####### ",
        "  #     # ",
        "  # $ $ # ",
        "  # . . # ",
        "  # $ $ # ",
        "  # . . # ",
        "  #  @  # ",
        "  ####### "
    ],
    [
        "############",
        "#          #",
        "# $ $ $ $  #",
        "#          #",
        "# ........ #",
        "# $ $ $ $  #",
        "#     @    #",
        "############"
    ]
];

class Game {
    constructor() {
        this.currentLevelIndex = 0;
        this.moves = 0;
        this.grid = [];
        this.playerPos = { x: 0, y: 0 };
        this.gameGridElement = document.getElementById('game-grid');
        this.levelDisplay = document.getElementById('level-display');
        this.movesDisplay = document.getElementById('moves-display');

        this.init();
        this.bindEvents();
    }

    init() {
        const levelData = LEVELS[this.currentLevelIndex];
        this.grid = levelData.map(row => row.split(''));
        this.moves = 0;
        this.updateStatus();
        this.findPlayer();
        this.render();
    }

    findPlayer() {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                if (this.grid[y][x] === '@' || this.grid[y][x] === '+') {
                    this.playerPos = { x, y };
                    return;
                }
            }
        }
    }

    updateStatus() {
        this.levelDisplay.textContent = this.currentLevelIndex + 1;
        this.movesDisplay.textContent = this.moves;
    }

    render() {
        const height = this.grid.length;
        const width = this.grid[0].length;

        this.gameGridElement.style.gridTemplateColumns = `repeat(${width}, 40px)`;
        this.gameGridElement.innerHTML = '';

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cellType = this.grid[y][x];
                const cell = document.createElement('div');
                cell.className = 'cell';

                switch (cellType) {
                    case '#':
                        cell.classList.add('wall');
                        break;
                    case '$':
                        cell.classList.add('box');
                        break;
                    case '*':
                        cell.classList.add('box', 'on-target');
                        break;
                    case '.':
                        cell.classList.add('target');
                        break;
                    case '@':
                        cell.classList.add('player');
                        cell.innerHTML = '<div class="player-sprite"><div class="legs"></div></div>';
                        break;
                    case '+':
                        cell.classList.add('player', 'target');
                        cell.innerHTML = '<div class="player-sprite"><div class="legs"></div></div>';
                        break;
                }
                this.gameGridElement.appendChild(cell);
            }
        }
    }

    move(dx, dy) {
        const newX = this.playerPos.x + dx;
        const newY = this.playerPos.y + dy;
        const targetCell = this.grid[newY][newX];

        if (targetCell === '#') return; // Wall

        if (targetCell === '$' || targetCell === '*') {
            // Push box
            const boxNewX = newX + dx;
            const boxNewY = newY + dy;
            const boxTargetCell = this.grid[boxNewY][boxNewX];

            if (boxTargetCell === ' ' || boxTargetCell === '.') {
                // Move box
                this.grid[boxNewY][boxNewX] = boxTargetCell === '.' ? '*' : '$';
                // Move player into old box pos
                this.grid[newY][newX] = targetCell === '*' ? '+' : '@';
                // Clear old player pos
                const oldCell = this.grid[this.playerPos.y][this.playerPos.x];
                this.grid[this.playerPos.y][this.playerPos.x] = oldCell === '+' ? '.' : ' ';

                this.playerPos = { x: newX, y: newY };
                this.moves++;
                this.checkWin();
                this.render();
                this.updateStatus();
            }
        } else {
            // Normal move
            this.grid[newY][newX] = targetCell === '.' ? '+' : '@';
            const oldCell = this.grid[this.playerPos.y][this.playerPos.x];
            this.grid[this.playerPos.y][this.playerPos.x] = oldCell === '+' ? '.' : ' ';

            this.playerPos = { x: newX, y: newY };
            this.moves++;
            this.render();
            this.updateStatus();
        }
    }

    checkWin() {
        const isWon = this.grid.every(row => !row.includes('$'));
        if (isWon) {
            setTimeout(() => {
                alert('LEVEL COMPLETE!');
                this.currentLevelIndex++;
                if (this.currentLevelIndex < LEVELS.length) {
                    this.init();
                } else {
                    alert('YOU WIN EVERYTHING! RESETTING TO LEVEL 1.');
                    this.currentLevelIndex = 0;
                    this.init();
                }
            }, 100);
        }
    }

    bindEvents() {
        window.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    this.move(0, -1);
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.move(0, 1);
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.move(-1, 0);
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.move(1, 0);
                    break;
                case 'r':
                case 'R':
                    this.init();
                    break;
            }
        });
    }
}

// Start game
new Game();
