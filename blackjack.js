// Simple Blackjack implementation with dealer AI (hits until 17)
class BlackjackGame {
    constructor() {
        this.deck = [];
        this.player = [];
        this.dealer = [];
        this.playerChips = this.loadSharedChips();
        this.currentBet = 0;
        this.isRoundActive = false;

        this.cacheElements();
        this.setupListeners();
        // initialize UI
        this.playerChipsEl.textContent = this.playerChips;
        this.betInput.max = this.playerChips;
        this.betInput.value = Math.min(10, this.playerChips);
        this.onBetChange();

        this.log('Welcome to Blackjack — set your bet and click Deal to start.');
    }

    cacheElements() {
        this.playerCardsEl = document.getElementById('player-cards');
        this.dealerCardsEl = document.getElementById('dealer-cards');
        this.playerScoreVal = document.getElementById('player-score-val');
        this.dealerScoreVal = document.getElementById('dealer-score-val');
        this.dealBtn = document.getElementById('deal-btn');
        this.hitBtn = document.getElementById('hit-btn');
        this.standBtn = document.getElementById('stand-btn');
        this.betInput = document.getElementById('bet-input');
        this.betAllBtn = document.getElementById('bet-all-btn');
        this.logEl = document.getElementById('log-content');
        this.playerChipsEl = document.getElementById('player-chips');
    }

    setupListeners() {
        this.dealBtn.addEventListener('click', () => this.startRound());
        this.hitBtn.addEventListener('click', () => this.playerHit());
        this.standBtn.addEventListener('click', () => this.playerStand());
        this.betInput.addEventListener('input', () => this.onBetChange());
        if (this.betAllBtn) this.betAllBtn.addEventListener('click', () => this.betAll());
        const newGameBtn = document.getElementById('new-game-btn');
        if (newGameBtn) newGameBtn.addEventListener('click', () => this.newGame());
    }

    createDeck() {
        const suits = ['♠','♥','♦','♣'];
        const ranks = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        this.deck = [];
        for (let s of suits) for (let r of ranks) this.deck.push({suit: s, rank: r});
        // shuffle
        for (let i = this.deck.length -1; i>0; i--) {
            const j = Math.floor(Math.random()*(i+1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    startRound() {
        if (this.isRoundActive) return;
        // validate bet
        const bet = Number(this.betInput.value) || 0;
        if (!Number.isFinite(bet) || bet <= 0) { this.log('Set a valid bet before dealing.'); return; }
        if (bet > this.playerChips) { this.log('Bet exceeds your available chips.'); return; }

        this.currentBet = bet;
        // deduct bet from chips (reserve the stake) and update UI
        this.playerChips -= this.currentBet;
        this.playerChipsEl.textContent = this.playerChips;
        this.saveSharedChips();

        this.isRoundActive = true;
        this.dealBtn.disabled = true;
        this.betInput.disabled = true;
        if (this.betAllBtn) this.betAllBtn.disabled = true;
        this.createDeck();
        this.player = [this.deck.pop(), this.deck.pop()];
        this.dealer = [this.deck.pop(), this.deck.pop()];
        this.updateButtons();
        this.renderHands(true);
        // Log dealt hands (show player's cards and dealer up-card)
        const playerCardsStr = this.player.map(c => c.rank + c.suit).join(' ');
        const dealerUp = this.dealer.length ? this.dealer[0].rank + this.dealer[0].suit : '';
        this.log(`Dealt cards. Bet: $${this.currentBet}. You: ${playerCardsStr} (Score: ${this.valueOfHand(this.player)}). Dealer shows: ${dealerUp}.`);
        this.updateScores();
        // enable actions
        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;
    }

    renderHands(hideDealerHole = true) {
        this.playerCardsEl.innerHTML = '';
        this.dealerCardsEl.innerHTML = '';

        for (let card of this.player) {
            const el = this.createCardEl(card);
            this.playerCardsEl.appendChild(el);
        }

        // Dealer: show first card, hide hole if requested
        if (this.dealer.length) {
            const first = this.createCardEl(this.dealer[0]);
            this.dealerCardsEl.appendChild(first);
            if (hideDealerHole) {
                const back = document.createElement('div');
                back.className = 'card card-back';
                this.dealerCardsEl.appendChild(back);
            } else {
                for (let i=1;i<this.dealer.length;i++) this.dealerCardsEl.appendChild(this.createCardEl(this.dealer[i]));
            }
        }
    }

    createCardEl(card) {
        const el = document.createElement('div');
        el.className = `card ${card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'}`;
        el.innerHTML = `<div style="font-size:1.2rem;margin-bottom:6px">${card.rank}</div><div style="font-size:1.2rem">${card.suit}</div>`;
        return el;
    }

    valueOfHand(hand) {
        let total = 0;
        let aces = 0;
        for (let c of hand) {
            if (c.rank === 'J' || c.rank === 'Q' || c.rank === 'K') total += 10;
            else if (c.rank === 'A') { total += 11; aces += 1; }
            else total += parseInt(c.rank,10);
        }
        while (total > 21 && aces > 0) { total -= 10; aces -= 1; }
        return total;
    }

    updateScores(revealDealer=false) {
        const pVal = this.valueOfHand(this.player);
        this.playerScoreVal.textContent = pVal;
        if (revealDealer) this.dealerScoreVal.textContent = this.valueOfHand(this.dealer);
        else this.dealerScoreVal.textContent = '--';
    }

    playerHit() {
        if (!this.isRoundActive) return;
        const card = this.deck.pop();
        this.player.push(card);
        this.renderHands(true);
        this.updateScores();
        const pVal = this.valueOfHand(this.player);
        this.log(`You hit: ${card.rank}${card.suit} (Score: ${pVal})`);
        if (pVal > 21) {
            this.log('You busted — dealer wins.');
            this.endRound('dealer');
        }
    }

    playerStand() {
        if (!this.isRoundActive) return;
        this.log(`You stand (Score: ${this.valueOfHand(this.player)}). Dealer reveals and plays.`);
        this.dealerPlay();
    }

    dealerPlay() {
        // reveal hole and play by simple AI: hit until 17 or more
        this.renderHands(false);
        this.updateScores(true);

        const playStep = () => {
            const dVal = this.valueOfHand(this.dealer);
            if (dVal < 17) {
                // dealer hits
                const card = this.deck.pop();
                this.dealer.push(card);
                this.renderHands(false);
                this.updateScores(true);
                this.log(`Dealer draws ${card.rank}${card.suit} (Score: ${this.valueOfHand(this.dealer)})`);
                if (this.valueOfHand(this.dealer) > 21) {
                    this.log('Dealer busts — you win!');
                    this.endRound('player');
                    return;
                }
                setTimeout(playStep, 700);
            } else {
                this.log(`Dealer stands (Score: ${dVal}).`);
                this.determineWinner();
            }
        };

        setTimeout(playStep, 700);
    }

    determineWinner() {
        const pVal = this.valueOfHand(this.player);
        const dVal = this.valueOfHand(this.dealer);
        if (dVal > 21) {
            this.log('Dealer busted — you win!');
            this.endRound('player');
            return;
        }
        if (pVal > dVal) {
            this.log(`You win (${pVal} vs ${dVal})!`);
            this.endRound('player');
        } else if (pVal < dVal) {
            this.log(`Dealer wins (${dVal} vs ${pVal}).`);
            this.endRound('dealer');
        } else {
            this.log(`Push: ${pVal} ties ${dVal}.`);
            this.endRound('push');
        }
    }

    endRound(winner) {
        this.isRoundActive = false;
        this.updateScores(true);
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        // chip handling based on reserved bet
        if (winner === 'player') {
            // player already had bet removed; payout 2x bet (original + winnings)
            this.playerChips += this.currentBet * 2;
            this.log(`You win $${this.currentBet}.`);
        } else if (winner === 'dealer') {
            // player already lost the reserved bet
            this.log(`You lose $${this.currentBet}.`);
        } else if (winner === 'push') {
            // refund the reserved bet
            this.playerChips += this.currentBet;
            this.log('Push — your bet is returned.');
        }

        this.playerChipsEl.textContent = this.playerChips;
        this.saveSharedChips();

        // reset bet and enable deal for next round
        this.currentBet = 0;
        this.dealBtn.disabled = false;
        this.betInput.disabled = false;
        if (this.betAllBtn) this.betAllBtn.disabled = false;
        this.betInput.max = this.playerChips;
        this.betInput.value = Math.min(10, Math.max(1, this.playerChips));
        this.onBetChange();
    }

    log(msg) {
        // Match poker log format: [HH:MM:SS] message and insert at top, keep scroll at top
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
        if (this.logEl.firstChild) this.logEl.insertBefore(entry, this.logEl.firstChild);
        else this.logEl.appendChild(entry);
        this.logEl.scrollTop = 0;
    }

    updateButtons() {
        this.dealBtn.disabled = true;
        this.hitBtn.disabled = false;
        this.standBtn.disabled = false;
    }

    onBetChange() {
        const val = Number(this.betInput.value) || 0;
        if (val > 0 && val <= this.playerChips) this.dealBtn.disabled = false;
        else this.dealBtn.disabled = true;
    }

    betAll() {
        if (this.playerChips <= 0) { this.log('No chips to bet.'); return; }
        this.betInput.value = this.playerChips;
        this.onBetChange();
        this.log(`Bet set to ALL: $${this.betInput.value}`);
    }

    newGame() {
        this.playerChips = 1000;
        this.currentBet = 0;
        this.isRoundActive = false;
        this.player = [];
        this.dealer = [];
        this.deck = [];

        this.playerCardsEl.innerHTML = '';
        this.dealerCardsEl.innerHTML = '';
        this.playerScoreVal.textContent = '0';
        this.dealerScoreVal.textContent = '--';
        this.playerChipsEl.textContent = this.playerChips;
        this.betInput.disabled = false;
        if (this.betAllBtn) this.betAllBtn.disabled = false;
        this.dealBtn.disabled = false;
        this.hitBtn.disabled = true;
        this.standBtn.disabled = true;
        this.betInput.max = this.playerChips;
        this.betInput.value = Math.min(10, this.playerChips);
        this.onBetChange();
        this.saveSharedChips();
        this.log('New game started! Your chips have been reset.');
    }

    loadSharedChips() {
        const stored = localStorage.getItem('casinoPlayerChips');
        const chips = stored !== null ? Number(stored) : 1000;
        return Number.isFinite(chips) && chips >= 0 ? Math.floor(chips) : 1000;
    }

    saveSharedChips() {
        localStorage.setItem('casinoPlayerChips', String(this.playerChips));
    }
}

// Initialize when DOM ready
window.addEventListener('DOMContentLoaded', () => {
    new BlackjackGame();
});
