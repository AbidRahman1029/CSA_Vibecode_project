class RouletteGame {
    constructor() {
        this.wheelNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
        this.redNumbers = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
        this.bets = {};
        this.totalBet = 0;
        this.playerChips = 0;
        this.isSpinning = false;

        this.cacheElements();
        this.playerChips = this.loadSharedChips();
        this.updateChipDisplay();
        this.createWheelNumbers();
        this.createBoard();
        this.setupListeners();
        this.log('Place a bet amount, then click a number to place your chip.');
    }

    cacheElements() {
        this.wheelElement = document.getElementById('roulette-wheel');
        this.wheelNumbersContainer = document.querySelector('.wheel-numbers');
        this.spinResultEl = document.getElementById('spin-result');
        this.logEl = document.getElementById('log-content');
        this.boardEl = document.getElementById('roulette-board');
        this.playerChipsEl = document.getElementById('player-chips');
        this.totalBetEl = document.getElementById('total-bet');
        this.betInput = document.getElementById('bet-input');
        this.spinBtn = document.getElementById('spin-btn');
        this.clearBtn = document.getElementById('clear-btn');
    }

    loadSharedChips() {
        const stored = localStorage.getItem('casinoPlayerChips');
        const chips = stored !== null ? Number(stored) : 1000;
        return Number.isFinite(chips) && chips >= 0 ? Math.floor(chips) : 1000;
    }

    saveSharedChips() {
        localStorage.setItem('casinoPlayerChips', String(this.playerChips));
    }

    setupListeners() {
        this.spinBtn.addEventListener('click', () => this.spinWheel());
        this.clearBtn.addEventListener('click', () => this.clearBets(true));
        this.betInput.addEventListener('input', () => {
            const value = Number(this.betInput.value);
            if (value < 1) this.betInput.value = 1;
        });
    }

    createWheelNumbers() {
        this.wheelNumbersContainer.innerHTML = '';
        const angleStep = 360 / this.wheelNumbers.length;
        this.wheelNumbers.forEach((number, index) => {
            const numberEl = document.createElement('div');
            numberEl.className = `wheel-number ${number === 0 ? 'zero' : (this.redNumbers.has(number) ? 'red' : 'black')}`;
            numberEl.textContent = number;
            const angle = index * angleStep;
            numberEl.style.transform = `rotate(${angle}deg) translateY(-188px) rotate(${-angle}deg)`;
            this.wheelNumbersContainer.appendChild(numberEl);
        });
    }

    createBoard() {
        this.boardEl.innerHTML = '';

        const mainBoard = document.createElement('div');
        mainBoard.className = 'roulette-main-board';

        // Zero cell spans full width
        const zeroCell = this.createBoardCell('0', 'num:0', ['zero']);
        mainBoard.appendChild(zeroCell);

        // Arrange numbers vertically by column (1,4,7,10... | 2,5,8,11... | 3,6,9,12...)
        // Create 12 rows × 3 columns + "2 to 1" labels
        for (let row = 0; row < 12; row++) {
            // Column 1 numbers (where number % 3 === 1)
            const num1 = row * 3 + 1;
            const cell1 = this.createBoardCell(String(num1), `num:${num1}`, [this.redNumbers.has(num1) ? 'red' : 'black']);
            mainBoard.appendChild(cell1);

            // Column 2 numbers (where number % 3 === 2)
            const num2 = row * 3 + 2;
            const cell2 = this.createBoardCell(String(num2), `num:${num2}`, [this.redNumbers.has(num2) ? 'red' : 'black']);
            mainBoard.appendChild(cell2);

            // Column 3 numbers (where number % 3 === 0)
            const num3 = row * 3 + 3;
            const cell3 = this.createBoardCell(String(num3), `num:${num3}`, [this.redNumbers.has(num3) ? 'red' : 'black']);
            mainBoard.appendChild(cell3);

            // "2 to 1" label for this row's columns
            const columnCell = this.createBoardCell('2 to 1', `column${(row % 3) + 1}`, ['column-bet']);
            mainBoard.appendChild(columnCell);
        }

        // Outside bets: 1-18, EVEN, RED, BLACK, ODD, 19-36
        const outsideBoard = document.createElement('div');
        outsideBoard.className = 'roulette-outside-bets';
        outsideBoard.appendChild(this.createBoardCell('1 to 18', 'low', ['outside-bet']));
        outsideBoard.appendChild(this.createBoardCell('EVEN', 'even', ['outside-bet']));
        
        const redCell = this.createBoardCell('◆', 'red', ['outside-bet', 'red-diamond']);
        outsideBoard.appendChild(redCell);
        
        const blackCell = this.createBoardCell('◆', 'black', ['outside-bet', 'black-diamond']);
        outsideBoard.appendChild(blackCell);
        
        outsideBoard.appendChild(this.createBoardCell('ODD', 'odd', ['outside-bet']));
        outsideBoard.appendChild(this.createBoardCell('19 to 36', 'high', ['outside-bet']));

        this.boardEl.appendChild(mainBoard);
        this.boardEl.appendChild(outsideBoard);
    }

    createBoardCell(label, betKey, extraClasses = []) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = ['board-cell', ...extraClasses].join(' ');
        cell.dataset.betKey = betKey;
        cell.innerHTML = `<span>${label}</span>`;
        cell.addEventListener('mouseenter', () => this.showPreview(cell));
        cell.addEventListener('mouseleave', () => this.hidePreview(cell));
        cell.addEventListener('click', () => this.placeBet(betKey, cell));
        return cell;
    }

    showPreview(cell) {
        if (this.isSpinning) return;
        this.removePreview(cell);
        const betAmount = Number(this.betInput.value) || 0;
        if (betAmount < 1 || betAmount > this.playerChips) return;

        const preview = document.createElement('div');
        preview.className = 'chip-preview';
        preview.textContent = `$${betAmount}`;
        cell.appendChild(preview);
    }

    hidePreview(cell) {
        this.removePreview(cell);
    }

    removePreview(cell) {
        const existing = cell.querySelector('.chip-preview');
        if (existing) existing.remove();
    }

    placeBet(betKey, cell) {
        if (this.isSpinning) return;
        const amount = Number(this.betInput.value) || 0;
        if (!Number.isFinite(amount) || amount <= 0) {
            this.log('Enter a valid bet amount before placing chips.');
            return;
        }
        if (amount > this.playerChips) {
            this.log('Not enough chips to place that bet.');
            return;
        }

        this.playerChips -= amount;
        this.saveSharedChips();
        this.bets[betKey] = (this.bets[betKey] || 0) + amount;
        this.totalBet += amount;
        this.updateChipDisplay();

        let chip = cell.querySelector('.chip-token');
        if (!chip) {
            chip = document.createElement('div');
            chip.className = 'chip-token';
            cell.appendChild(chip);
        }
        chip.textContent = `$${this.bets[betKey]}`;
        const label = cell.querySelector('span') ? cell.querySelector('span').textContent : cell.dataset.betKey;
        this.log(`Placed $${amount} on ${label}.`);
    }

    updateChipDisplay() {
        this.playerChipsEl.textContent = this.playerChips;
        this.totalBetEl.textContent = this.totalBet;
        this.spinBtn.disabled = this.totalBet === 0 || this.isSpinning;
        this.clearBtn.disabled = this.totalBet === 0 || this.isSpinning;
    }

    clearBets(refundChips = false) {
        if (this.totalBet === 0) return;
        if (refundChips) {
            this.playerChips += this.totalBet;
            this.saveSharedChips();
            this.log(`Cleared bets and refunded $${this.totalBet}.`);
        }

        this.bets = {};
        this.totalBet = 0;
        this.boardEl.querySelectorAll('.chip-token, .chip-preview').forEach(el => el.remove());
        this.updateChipDisplay();
    }

    getBetResults(number) {
        return {
            red: number !== 0 && this.redNumbers.has(number),
            black: number !== 0 && !this.redNumbers.has(number),
            odd: number !== 0 && number % 2 === 1,
            even: number !== 0 && number % 2 === 0,
            low: number >= 1 && number <= 18,
            high: number >= 19 && number <= 36,
            dozen1: number >= 1 && number <= 12,
            dozen2: number >= 13 && number <= 24,
            dozen3: number >= 25 && number <= 36,
            column1: number !== 0 && number % 3 === 1,
            column2: number !== 0 && number % 3 === 2,
            column3: number !== 0 && number % 3 === 0
        };
    }

    spinWheel() {
        if (this.isSpinning) return;
        if (this.totalBet === 0) {
            this.log('Place at least one chip before spinning.');
            return;
        }

        this.isSpinning = true;
        this.spinBtn.disabled = true;
        this.clearBtn.disabled = true;
        this.boardEl.querySelectorAll('.board-cell').forEach(cell => cell.disabled = true);
        this.wheelElement.classList.add('spinning');
        this.spinResultEl.textContent = 'Spinning...';
        this.log('The wheel is spinning. Good luck!');

        setTimeout(() => {
            const winner = this.wheelNumbers[Math.floor(Math.random() * this.wheelNumbers.length)];
            const results = this.getBetResults(winner);
            let payout = 0;
            const winningBets = [];

            Object.entries(this.bets).forEach(([betKey, amount]) => {
                if (betKey.startsWith('num:')) {
                    const target = Number(betKey.split(':')[1]);
                    if (target === winner) {
                        payout += amount * 36;
                        winningBets.push(this.labelForBetKey(betKey));
                    }
                } else if (results[betKey]) {
                    const multiplier = betKey.startsWith('dozen') || betKey.startsWith('column') ? 3 : 2;
                    payout += amount * multiplier;
                    winningBets.push(this.labelForBetKey(betKey));
                }
            });

            this.wheelElement.classList.remove('spinning');
            this.isSpinning = false;
            const spinText = `${winner} ${results.red ? '(Red)' : results.black ? '(Black)' : '(Green)'}`;
            this.spinResultEl.textContent = spinText;

            if (payout > 0) {
                this.playerChips += payout;
                this.log(`The ball lands on ${spinText}. You win $${payout}!`);
            } else {
                this.log(`The ball lands on ${spinText}. You lost $${this.totalBet}.`);
            }

            this.saveSharedChips();
            this.highlightWinner(winner, results);
            this.clearBets(false);
            this.updateChipDisplay();
            this.boardEl.querySelectorAll('.board-cell').forEach(cell => cell.disabled = false);
        }, 3600);
    }

    labelForBetKey(betKey) {
        if (betKey.startsWith('num:')) return betKey.split(':')[1];
        const labels = {
            red: 'Red',
            black: 'Black',
            odd: 'Odd',
            even: 'Even',
            low: '1 - 18',
            high: '19 - 36',
            dozen1: '1st 12',
            dozen2: '2nd 12',
            dozen3: '3rd 12',
            column1: 'Column 1',
            column2: 'Column 2',
            column3: 'Column 3'
        };
        return labels[betKey] || betKey;
    }

    highlightWinner(number, results) {
        this.boardEl.querySelectorAll('.board-cell').forEach(cell => {
            const key = cell.dataset.betKey;
            const isNumber = key === `num:${number}`;
            const isOutside = key && results[key];
            cell.classList.toggle('winner', Boolean(isNumber || isOutside));
        });
        setTimeout(() => {
            this.boardEl.querySelectorAll('.board-cell.winner').forEach(cell => cell.classList.remove('winner'));
        }, 2600);
    }

    log(message) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        if (this.logEl.firstChild) this.logEl.insertBefore(entry, this.logEl.firstChild);
        else this.logEl.appendChild(entry);
        this.logEl.scrollTop = 0;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new RouletteGame();
});
