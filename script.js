class PokerGame {
    constructor() {
        this.deck = [];
        this.playerHand = [];
        this.computerHand = [];
        this.communityCards = [];
        this.pot = 0;
        this.currentRound = 'Pre-Flop';
        this.playerChips = this.loadSharedChips();
        this.computerChips = 1000;
        this.currentBet = 0;
        this.playerBet = 0;
        this.computerBet = 0;
        this.gamePhase = 'waiting'; // waiting, dealing, betting, showdown
        this.isPlayerTurn = true;
        
        this.initializeDeck();
        this.setupEventListeners();
        this.updateUI();
        this.addLogEntry('Welcome to Texas Hold\'em Poker! Click "Deal Cards" to start.');
    }

    initializeDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        
        this.deck = [];
        for (let suit of suits) {
            for (let rank of ranks) {
                this.deck.push({
                    suit: suit,
                    rank: rank,
                    value: this.getCardValue(rank),
                    isRed: suit === '♥' || suit === '♦'
                });
            }
        }
    }

    getCardValue(rank) {
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[rank];
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    loadSharedChips() {
        const stored = localStorage.getItem('casinoPlayerChips');
        const chips = stored !== null ? Number(stored) : 1000;
        return Number.isFinite(chips) && chips >= 0 ? Math.floor(chips) : 1000;
    }

    saveSharedChips() {
        localStorage.setItem('casinoPlayerChips', String(this.playerChips));
    }

    dealCards() {
        if (this.gamePhase !== 'waiting') {
            this.addLogEntry('Cannot deal cards - game is not in waiting phase');
            return;
        }
        
        this.gamePhase = 'dealing';
        this.addLogEntry('Dealing new hand...');
        
        // Initialize fresh deck
        this.initializeDeck();
        this.shuffleDeck();
        
        // Clear previous hands
        this.playerHand = [];
        this.computerHand = [];
        this.communityCards = [];
        this.pot = 0;
        this.currentBet = 0;
        this.playerBet = 0;
        this.computerBet = 0;
        this.currentRound = 'Pre-Flop';
        
        // Deal hole cards
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.computerHand = [this.deck.pop(), this.deck.pop()];
        
        this.displayCards();
        this.gamePhase = 'betting';
        this.isPlayerTurn = true;
        
        this.addLogEntry('Cards dealt. Your turn to bet.');
        this.updateUI();
        this.enableBettingControls();
    }

    displayCards() {
        // Display player cards
        this.displayCard('player-1-card-1', this.playerHand[0]);
        this.displayCard('player-1-card-2', this.playerHand[1]);
        
        // Display computer cards (face down)
        document.getElementById('player-2-card-1').className = 'card card-back';
        document.getElementById('player-2-card-2').className = 'card card-back';
        
        // Clear community cards
        const communityCardIds = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        communityCardIds.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card-placeholder';
            element.innerHTML = '';
        });
        
        this.updateHandDescription();
    }

    displayCard(elementId, card) {
        const element = document.getElementById(elementId);
        element.className = `card ${card.isRed ? 'red' : 'black'}`;
        element.innerHTML = `
            <div style="font-size: 1.5rem; margin-bottom: 5px;">${card.rank}</div>
            <div style="font-size: 1.2rem;">${card.suit}</div>
        `;
        element.classList.add('deal-animation');
        setTimeout(() => element.classList.remove('deal-animation'), 500);
    }

    dealCommunityCards() {
        if (this.currentRound === 'Pre-Flop') {
            // Deal flop
            this.communityCards = [this.deck.pop(), this.deck.pop(), this.deck.pop()];
            this.currentRound = 'Flop';
            this.displayCommunityCards();
            this.addLogEntry('Flop dealt: ' + this.communityCards.map(c => c.rank + c.suit).join(' '));
            
            // After flop, start new betting round
            this.startNewBettingRound();
        } else if (this.currentRound === 'Flop') {
            // Deal turn
            this.communityCards.push(this.deck.pop());
            this.currentRound = 'Turn';
            this.displayCommunityCards();
            this.addLogEntry('Turn dealt: ' + this.communityCards[3].rank + this.communityCards[3].suit);
            
            // After turn, start new betting round
            this.startNewBettingRound();
        } else if (this.currentRound === 'Turn') {
            // Deal river
            this.communityCards.push(this.deck.pop());
            this.currentRound = 'River';
            this.displayCommunityCards();
            this.addLogEntry('River dealt: ' + this.communityCards[4].rank + this.communityCards[4].suit);
            
            // After river, start new betting round
            this.startNewBettingRound();
        }
        
        this.updateUI();
        this.updateHandDescription();
    }

    clearAllCards() {
        // Clear player cards
        const playerCardIds = ['player-1-card-1', 'player-1-card-2'];
        playerCardIds.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card';
            element.innerHTML = '';
        });
        
        // Clear computer cards (face down)
        const computerCardIds = ['player-2-card-1', 'player-2-card-2'];
        computerCardIds.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card card-back';
            element.innerHTML = '';
        });
        
        // Clear community cards
        const communityCardIds = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        communityCardIds.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card-placeholder';
            element.innerHTML = '';
        });
    }

    startNewBettingRound() {
        // Reset betting for new round
        this.currentBet = 0;
        this.playerBet = 0;
        this.computerBet = 0;
        this.isPlayerTurn = true;
        this.gamePhase = 'betting';
        
        this.addLogEntry(`New betting round: ${this.currentRound}. Your turn to act first.`);
        this.addLogEntry(`DEBUG: Current bet: $${this.currentBet}, Player bet: $${this.playerBet}, Computer bet: $${this.computerBet}`);
        this.enableBettingControls();
        this.updateUI();
        this.addLogEntry(`UI Updated - Player chips: $${this.playerChips}, Computer chips: $${this.computerChips}, Pot: $${this.pot}`);
    }

    displayCommunityCards() {
        const flopElements = ['flop-1', 'flop-2', 'flop-3'];
        const turnElement = 'turn';
        const riverElement = 'river';
        
        // Display flop cards
        for (let i = 0; i < Math.min(3, this.communityCards.length); i++) {
            const element = document.getElementById(flopElements[i]);
            element.className = 'card-placeholder filled';
            this.displayCard(flopElements[i], this.communityCards[i]);
        }
        
        // Display turn card
        if (this.communityCards.length >= 4) {
            const element = document.getElementById(turnElement);
            element.className = 'card-placeholder filled';
            this.displayCard(turnElement, this.communityCards[3]);
        }
        
        // Display river card
        if (this.communityCards.length >= 5) {
            const element = document.getElementById(riverElement);
            element.className = 'card-placeholder filled';
            this.displayCard(riverElement, this.communityCards[4]);
        }
    }

    fold() {
        if (!this.isPlayerTurn) {
            this.addLogEntry('Not your turn to fold');
            return;
        }
        if (this.gamePhase !== 'betting') {
            this.addLogEntry('Cannot fold - not in betting phase');
            return;
        }
        
        this.addLogEntry('You folded. Computer wins the pot.');
        this.computerChips += this.pot;
        this.pot = 0;
        this.endHand();
    }

    call() {
        if (!this.isPlayerTurn) {
            this.addLogEntry('Not your turn to call');
            return;
        }
        if (this.gamePhase !== 'betting') {
            this.addLogEntry('Cannot call - not in betting phase');
            return;
        }
        
        const callAmount = this.currentBet - this.playerBet;
        
        // Validate call amount
        if (callAmount <= 0) {
            this.addLogEntry('No bet to call - you can check instead');
            return;
        }
        
        if (callAmount > this.playerChips) {
            this.allIn();
            return;
        }
        
        this.playerChips -= callAmount;
        this.playerBet += callAmount;
        this.pot += callAmount;
        
        this.addLogEntry(`You called $${callAmount}`);
        this.isPlayerTurn = false;
        this.updateUI(); // Update UI to show new chip amounts
        this.computerAction();
    }

    check() {
        if (!this.isPlayerTurn) {
            this.addLogEntry('Not your turn to check');
            return;
        }
        if (this.gamePhase !== 'betting') {
            this.addLogEntry('Cannot check - not in betting phase');
            return;
        }
        
        // Can only check if there's no bet to call
        if (this.currentBet > this.playerBet) {
            this.addLogEntry('Cannot check - there is a bet to call');
            return;
        }
        
        this.addLogEntry('You checked');
        this.isPlayerTurn = false;
        this.updateUI(); // Update UI to show current state
        this.computerAction();
    }

    raise() {
        if (!this.isPlayerTurn) {
            this.addLogEntry('Not your turn to raise');
            return;
        }
        if (this.gamePhase !== 'betting') {
            this.addLogEntry('Cannot raise - not in betting phase');
            return;
        }
        
        const raiseAmount = parseInt(document.getElementById('bet-input').value);
        if (raiseAmount <= this.currentBet || raiseAmount > this.playerChips) {
            this.addLogEntry('Invalid raise amount');
            return;
        }
        
        const totalBet = raiseAmount - this.playerBet;
        this.playerChips -= totalBet;
        this.playerBet = raiseAmount;
        this.currentBet = raiseAmount;
        this.pot += totalBet;
        
        this.addLogEntry(`You raised to $${raiseAmount}`);
        this.isPlayerTurn = false;
        this.updateUI(); // Update UI to show new chip amounts
        this.computerAction();
    }

    allIn() {
        if (!this.isPlayerTurn) {
            this.addLogEntry('Not your turn to go all-in');
            return;
        }
        if (this.gamePhase !== 'betting') {
            this.addLogEntry('Cannot go all-in - not in betting phase');
            return;
        }
        
        const allInAmount = this.playerChips;
        this.playerChips = 0;
        this.playerBet += allInAmount;
        this.currentBet = Math.max(this.currentBet, this.playerBet);
        this.pot += allInAmount;
        
        this.addLogEntry(`You went all in with $${allInAmount}`);
        this.isPlayerTurn = false;
        this.updateUI(); // Update UI to show new chip amounts
        this.computerAction();
    }

    computerAction() {
        setTimeout(async () => {
            // Check if computer has no chips - must call or fold
            if (this.computerChips === 0) {
                this.addLogEntry('Computer has no chips left - must call or fold');
                
                // If there's a bet to call, computer must fold
                if (this.currentBet > this.computerBet) {
                    this.addLogEntry('Computer folds (no chips to call)');
                    this.playerChips += this.pot;
                    this.pot = 0;
                    this.updateUI();
                    this.endHand();
                } else {
                    // No bet to call, move to next phase
                    this.addLogEntry('No bet to call - moving to next phase');
                    if (this.communityCards.length < 5) {
                        this.dealCommunityCards();
                    } else {
                        this.showdown();
                    }
                }
                return;
            }
            
            // Simple AI logic
            const decision = await this.makeComputerDecision();
            
            if (decision === 'fold') {
                this.addLogEntry('Computer folded. You win the pot.');
                this.playerChips += this.pot;
                this.pot = 0;
                this.updateUI();
                this.endHand();
            } else if (decision === 'call') {
                const callAmount = this.currentBet - this.computerBet;
                if (callAmount >= this.computerChips) {
                    // Computer goes all-in
                    this.computerChips = 0;
                    this.computerBet += this.computerChips;
                    this.pot += this.computerChips;
                    this.addLogEntry('Computer went all-in');
                    
                    // Player must respond to all-in
                    this.isPlayerTurn = true;
                    this.enableBettingControls();
                    this.updateUI();
                } else {
                    // Computer calls normally
                    this.computerChips -= callAmount;
                    this.computerBet += callAmount;
                    this.pot += callAmount;
                    this.addLogEntry(`Computer called $${callAmount}`);
                    this.updateUI();
                    
                    // Both players have matched - move to next phase
                    if (this.communityCards.length < 5) {
                        this.addLogEntry('Both players matched bets. Dealing next community card...');
                        this.dealCommunityCards();
                    } else {
                        this.showdown();
                    }
                }
            } else if (decision === 'raise') {
                // Computer raises
                const handStrength = this.evaluateHand([...this.computerHand, ...this.communityCards]);
                let raiseAmount;
                
                if (handStrength >= 6) {
                    raiseAmount = Math.min(this.currentBet + 100, this.computerChips);
                } else if (handStrength >= 4) {
                    raiseAmount = Math.min(this.currentBet + 75, this.computerChips);
                } else {
                    raiseAmount = Math.min(this.currentBet + 25, this.computerChips);
                }
                
                this.computerChips -= raiseAmount;
                this.computerBet = raiseAmount;
                this.currentBet = raiseAmount;
                this.pot += raiseAmount;
                this.addLogEntry(`Computer raised to $${raiseAmount}`);
                this.updateUI();
                
                // Player must respond to raise
                this.isPlayerTurn = true;
                this.enableBettingControls();
            }
            
            this.updateUI();
        }, 1000);
    }

    makeComputerDecision() {
        // Enhanced AI with more balanced decision making
        const handStrength = this.evaluateHand([...this.computerHand, ...this.communityCards]);
        const randomFactor = Math.random(); // Add randomness for variety
        
        // Add some debugging
        this.addLogEntry(`Computer hand strength: ${handStrength} (${this.getHandDescription(handStrength)})`);
        
        // Check if computer can afford to raise
        const canRaise = this.computerChips > 0;
        
        // Computer is more aggressive now
        if (handStrength >= 6) {
            // Very strong hand - always raise if possible
            if (canRaise) {
                this.addLogEntry('Computer has very strong hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Computer has very strong hand - calling (no chips to raise)');
                return 'call';
            }
        } else if (handStrength >= 4) {
            // Strong hand - raise 70% of the time if possible, call 30%
            if (canRaise && randomFactor < 0.7) {
                this.addLogEntry('Computer has strong hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Computer has strong hand - calling');
                return 'call';
            }
        } else if (handStrength >= 2) {
            // Moderate hand - call 60% of the time, raise 20%, fold 20%
            if (randomFactor < 0.6) {
                this.addLogEntry('Computer has moderate hand - calling');
                return 'call';
            } else if (canRaise && randomFactor < 0.8) {
                this.addLogEntry('Computer has moderate hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Computer has moderate hand - folding');
                return 'fold';
            }
        } else {
            // Weak hand - but still call sometimes for variety
            if (randomFactor < 0.4) {
                this.addLogEntry('Computer has weak hand - calling (hoping for improvement)');
                return 'call';
            } else if (randomFactor < 0.6) {
                this.addLogEntry('Computer has weak hand - folding');
                return 'fold';
            } else if (canRaise) {
                this.addLogEntry('Computer has weak hand - bluffing with raise!');
                return 'raise'; // Occasionally bluff
            } else {
                this.addLogEntry('Computer has weak hand - calling (no chips to bluff)');
                return 'call';
            }
        }
    }

    async callPokerAPI() {
        // Professional PokerStars API integration
        const apiUrl = 'https://api.pokerstars.com/v1/poker/decision';
        
        const requestData = {
            holeCards: this.computerHand.map(card => `${card.rank}${card.suit}`),
            communityCards: this.communityCards.map(card => `${card.rank}${card.suit}`),
            potSize: this.pot,
            currentBet: this.currentBet,
            computerBet: this.computerBet,
            computerChips: this.computerChips,
            position: this.getPosition(),
            stackToPotRatio: this.computerChips / Math.max(1, this.pot),
            betToPotRatio: this.currentBet / Math.max(1, this.pot),
            street: this.currentRound.toLowerCase(),
            actionHistory: this.getActionHistory()
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_API_KEY_HERE' // You'll need to get an API key
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        const result = await response.json();
        
        // Log the professional decision
        this.addLogEntry(`Professional API Decision: ${result.action} (${result.reason})`);
        this.addLogEntry(`Confidence: ${result.confidence}%, EV: ${result.expectedValue}`);
        
        return result.action; // 'fold', 'call', 'raise', 'all-in'
    }

    getPosition() {
        // Determine position for poker strategy
        if (this.communityCards.length === 0) return 'early';
        if (this.communityCards.length <= 3) return 'middle';
        return 'late';
    }

    getActionHistory() {
        // Get recent action history for context
        return this.actionLog ? this.actionLog.slice(-5).map(log => log.action) : [];
    }

    fallbackAIDecision() {
        // Enhanced fallback AI - more balanced and realistic
        const handStrength = this.evaluateHand([...this.computerHand, ...this.communityCards]);
        const canRaise = this.computerChips > 0;
        const randomFactor = Math.random();
        
        // Calculate pot odds and position factors
        const potOdds = this.pot / Math.max(1, this.currentBet - this.computerBet);
        const position = this.getPosition();
        const stackToPotRatio = this.computerChips / Math.max(1, this.pot);
        
        this.addLogEntry(`Fallback AI - Hand: ${handStrength}, Pot odds: ${potOdds.toFixed(2)}, Position: ${position}`);
        
        // Very strong hands - always aggressive
        if (handStrength >= 6) {
            if (canRaise) {
                this.addLogEntry('Fallback AI: Very strong hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Fallback AI: Very strong hand - calling');
                return 'call';
            }
        }
        
        // Strong hands - raise most of the time
        if (handStrength >= 4) {
            if (canRaise && randomFactor < 0.8) {
                this.addLogEntry('Fallback AI: Strong hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Fallback AI: Strong hand - calling');
                return 'call';
            }
        }
        
        // Medium hands - call more often, raise sometimes
        if (handStrength >= 2) {
            if (canRaise && randomFactor < 0.4) {
                this.addLogEntry('Fallback AI: Medium hand - raising!');
                return 'raise';
            } else {
                this.addLogEntry('Fallback AI: Medium hand - calling');
                return 'call';
            }
        }
        
        // Weak hands - but still playable in good spots
        if (handStrength >= 1) {
            // Call with weak hands if pot odds are good or in late position
            if (potOdds > 3 || position === 'late') {
                this.addLogEntry('Fallback AI: Weak hand - calling (good pot odds/position)');
                return 'call';
            }
            
            // Occasionally bluff with weak hands
            if (canRaise && randomFactor < 0.3 && position === 'late') {
                this.addLogEntry('Fallback AI: Weak hand - bluffing!');
                return 'raise';
            }
            
            // Fold weak hands in bad spots
            this.addLogEntry('Fallback AI: Weak hand - folding (bad spot)');
            return 'fold';
        }
        
        // Very weak hands - fold most of the time
        this.addLogEntry('Fallback AI: Very weak hand - folding');
        return 'fold';
    }

    showdown() {
        this.gamePhase = 'showdown';
        this.addLogEntry('Showdown! Revealing all cards...');
        
        // Reveal computer cards
        this.displayCard('player-2-card-1', this.computerHand[0]);
        this.displayCard('player-2-card-2', this.computerHand[1]);
        
        // Add delay so player can see the cards
        setTimeout(() => {
            const playerScore = this.evaluateHand([...this.playerHand, ...this.communityCards]);
            const computerScore = this.evaluateHand([...this.computerHand, ...this.communityCards]);
            
            this.addLogEntry(`Your hand: ${this.getHandDescription(playerScore)}`);
            this.addLogEntry(`Computer's hand: ${this.getHandDescription(computerScore)}`);
            
            // Show the actual cards for debugging
            this.addLogEntry(`Your cards: ${this.playerHand.map(c => c.rank + c.suit).join(' ')}`);
            this.addLogEntry(`Computer's cards: ${this.computerHand.map(c => c.rank + c.suit).join(' ')}`);
            this.addLogEntry(`Community cards: ${this.communityCards.map(c => c.rank + c.suit).join(' ')}`);
            
            if (playerScore > computerScore) {
                this.addLogEntry('You win the pot!');
                this.playerChips += this.pot;
            } else if (computerScore > playerScore) {
                this.addLogEntry('Computer wins the pot!');
                this.computerChips += this.pot;
            } else {
                this.addLogEntry('It\'s a tie! Pot is split.');
                this.playerChips += Math.floor(this.pot / 2);
                this.computerChips += Math.floor(this.pot / 2);
            }
            
            this.pot = 0;
            
            // Add another delay before ending hand so player can read the results
            setTimeout(() => {
                this.endHand();
            }, 1500);
        }, 2000); // 2 second delay to see the cards
    }

    endHand() {
        this.gamePhase = 'waiting';
        this.currentBet = 0;
        this.playerBet = 0;
        this.computerBet = 0;
        this.currentRound = 'Pre-Flop';
        this.isPlayerTurn = true;
        
        // Clear all cards from display
        this.clearAllCards();
        
        this.disableBettingControls();
        this.updateUI();
        this.addLogEntry('Hand ended. Click "Deal Cards" for a new hand.');
        
        // Check if game is over
        if (this.playerChips === 0) {
            this.addLogEntry('Game Over! Computer wins!');
        } else if (this.computerChips === 0) {
            this.addLogEntry('Congratulations! You win!');
        }
    }

    // Debug function to show current game state
    debugGameState() {
        this.addLogEntry(`DEBUG: Game Phase: ${this.gamePhase}, Round: ${this.currentRound}, Player Turn: ${this.isPlayerTurn}`);
        this.addLogEntry(`DEBUG: Current Bet: $${this.currentBet}, Player Bet: $${this.playerBet}, Computer Bet: $${this.computerBet}`);
        this.addLogEntry(`DEBUG: Player Chips: $${this.playerChips}, Computer Chips: $${this.computerChips}`);
    }

    evaluateHand(cards) {
        if (cards.length < 5) {
            return this.evaluatePartialHand(cards);
        }
        
        // Sort cards by value
        cards.sort((a, b) => b.value - a.value);
        
        // Check for different hand types
        if (this.isRoyalFlush(cards)) return 10;
        if (this.isStraightFlush(cards)) return 9;
        if (this.isFourOfAKind(cards)) return 8;
        if (this.isFullHouse(cards)) return 7;
        if (this.isFlush(cards)) return 6;
        if (this.isStraight(cards)) return 5;
        if (this.isThreeOfAKind(cards)) return 4;
        if (this.isTwoPair(cards)) return 3;
        if (this.isOnePair(cards)) return 2;
        return 1; // High card
    }

    evaluatePartialHand(cards) {
        if (cards.length === 0) return 0;

        const groups = this.groupByRank(cards);
        const counts = Object.values(groups).map(group => group.length).sort((a, b) => b - a);
        const pairCount = counts.filter(count => count === 2).length;

        if (counts[0] >= 4) return 8;
        if (counts[0] === 3) return 4;
        if (pairCount >= 2) return 3;
        if (pairCount === 1) return 2;
        if (cards.length >= 3 && this.isFlush(cards)) return 6;
        if (cards.length >= 3 && this.isStraight(cards)) return 5;
        return 1;
    }

    isRoyalFlush(cards) {
        return this.isStraightFlush(cards) && cards[0].value === 14;
    }

    isStraightFlush(cards) {
        return this.isFlush(cards) && this.isStraight(cards);
    }

    isFourOfAKind(cards) {
        const groups = this.groupByRank(cards);
        return Object.values(groups).some(group => group.length === 4);
    }

    isFullHouse(cards) {
        const groups = this.groupByRank(cards);
        const values = Object.values(groups).map(group => group.length).sort((a, b) => b - a);
        return values[0] === 3 && values[1] === 2;
    }

    isFlush(cards) {
        const suit = cards[0].suit;
        return cards.every(card => card.suit === suit);
    }

    isStraight(cards) {
        // Check for straight by looking for 5 consecutive cards
        for (let i = 0; i < cards.length - 4; i++) {
            let consecutive = 1;
            let currentValue = cards[i].value;
            
            for (let j = i + 1; j < cards.length; j++) {
                if (cards[j].value === currentValue - 1) {
                    consecutive++;
                    currentValue = cards[j].value;
                    if (consecutive === 5) return true;
                } else if (cards[j].value < currentValue - 1) {
                    break; // Gap too large, can't be consecutive
                }
            }
        }
        
        // Special case: A-2-3-4-5 straight (wheel)
        if (cards.some(card => card.value === 14)) { // Has Ace
            const lowCards = cards.filter(card => card.value <= 5);
            if (lowCards.length >= 4) {
                const values = lowCards.map(card => card.value).sort((a, b) => a - b);
                if (values.includes(2) && values.includes(3) && values.includes(4) && values.includes(5)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    isThreeOfAKind(cards) {
        const groups = this.groupByRank(cards);
        return Object.values(groups).some(group => group.length === 3);
    }

    isTwoPair(cards) {
        const groups = this.groupByRank(cards);
        const pairs = Object.values(groups).filter(group => group.length === 2);
        return pairs.length >= 2;
    }

    isOnePair(cards) {
        const groups = this.groupByRank(cards);
        return Object.values(groups).some(group => group.length === 2);
    }

    groupByRank(cards) {
        const groups = {};
        cards.forEach(card => {
            if (!groups[card.rank]) groups[card.rank] = [];
            groups[card.rank].push(card);
        });
        return groups;
    }

    getHandDescription(score) {
        const descriptions = {
            1: 'High Card',
            2: 'One Pair',
            3: 'Two Pair',
            4: 'Three of a Kind',
            5: 'Straight',
            6: 'Flush',
            7: 'Full House',
            8: 'Four of a Kind',
            9: 'Straight Flush',
            10: 'Royal Flush'
        };
        return descriptions[score] || 'Unknown';
    }

    updateHandDescription() {
        if (this.playerHand.length === 0) {
            document.getElementById('hand-description').textContent = 'No cards dealt yet';
            return;
        }
        
        const allCards = [...this.playerHand, ...this.communityCards];
        const score = this.evaluateHand(allCards);
        const description = this.getHandDescription(score);
        document.getElementById('hand-description').textContent = description;
        
        // Debug: show what cards are being evaluated (only in showdown)
        if (allCards.length >= 5 && this.gamePhase === 'showdown') {
            this.addLogEntry(`DEBUG: Evaluating hand: ${allCards.map(c => c.rank + c.suit).join(' ')}`);
            this.addLogEntry(`DEBUG: Hand score: ${score} (${description})`);
        }
    }

    updateUI() {
        document.getElementById('pot-amount').textContent = this.pot;
        document.getElementById('current-round').textContent = this.currentRound;
        document.getElementById('player-1-chips').textContent = this.playerChips;
        document.getElementById('player-2-chips').textContent = this.computerChips;
        document.getElementById('player-1-bet').textContent = `$${this.playerBet}`;
        document.getElementById('player-2-bet').textContent = `$${this.computerBet}`;
        
        // Update player turn indicator
        document.getElementById('player-1').classList.toggle('active', this.isPlayerTurn);
        document.getElementById('player-2').classList.toggle('active', !this.isPlayerTurn);
        
        // Update bet input - for new betting rounds, start with small bet
        if (this.currentBet === 0) {
            // New betting round - start with small bet
            document.getElementById('bet-input').value = 10;
            document.getElementById('bet-input').min = 1;
        } else {
            // Must be higher than current bet to raise
            document.getElementById('bet-input').value = this.currentBet + 10;
            document.getElementById('bet-input').min = this.currentBet + 1;
        }
        document.getElementById('bet-input').max = this.playerChips;
        this.saveSharedChips();
    }

    enableBettingControls() {
        document.getElementById('fold-btn').disabled = false;
        document.getElementById('check-btn').disabled = false;
        document.getElementById('call-btn').disabled = false;
        document.getElementById('raise-btn').disabled = false;
        document.getElementById('all-in-btn').disabled = false;
        document.getElementById('deal-btn').disabled = true;
        this.addLogEntry('Betting controls enabled - you can now fold, check, call, raise, or all-in');
    }

    disableBettingControls() {
        document.getElementById('fold-btn').disabled = true;
        document.getElementById('check-btn').disabled = true;
        document.getElementById('call-btn').disabled = true;
        document.getElementById('raise-btn').disabled = true;
        document.getElementById('all-in-btn').disabled = true;
        document.getElementById('deal-btn').disabled = false;
    }

    addLogEntry(message) {
        const logContent = document.getElementById('log-content');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        
        // Insert new entry at the top instead of bottom
        if (logContent.firstChild) {
            logContent.insertBefore(entry, logContent.firstChild);
        } else {
            logContent.appendChild(entry);
        }
        
        // Keep scroll at top to show newest messages
        logContent.scrollTop = 0;
    }

    newGame() {
        this.playerChips = 1000;
        this.computerChips = 1000;
        this.pot = 0;
        this.currentBet = 0;
        this.playerBet = 0;
        this.computerBet = 0;
        this.currentRound = 'Pre-Flop';
        this.gamePhase = 'waiting';
        this.isPlayerTurn = true;
        
        // Clear cards
        this.playerHand = [];
        this.computerHand = [];
        this.communityCards = [];
        
        // Clear display
        const cardElements = ['player-1-card-1', 'player-1-card-2', 'player-2-card-1', 'player-2-card-2'];
        cardElements.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card';
            element.innerHTML = '';
        });
        
        const communityCardIds = ['flop-1', 'flop-2', 'flop-3', 'turn', 'river'];
        communityCardIds.forEach(id => {
            const element = document.getElementById(id);
            element.className = 'card-placeholder';
            element.innerHTML = '';
        });
        
        this.disableBettingControls();
        this.updateUI();
        this.updateHandDescription();
        this.addLogEntry('New game started!');
    }

    setupEventListeners() {
        document.getElementById('deal-btn').addEventListener('click', () => this.dealCards());
        document.getElementById('new-game-btn').addEventListener('click', () => this.newGame());
        document.getElementById('fold-btn').addEventListener('click', () => this.fold());
        document.getElementById('check-btn').addEventListener('click', () => this.check());
        document.getElementById('call-btn').addEventListener('click', () => this.call());
        document.getElementById('raise-btn').addEventListener('click', () => this.raise());
        document.getElementById('all-in-btn').addEventListener('click', () => this.allIn());
        
        // Initialize betting controls as disabled
        this.disableBettingControls();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PokerGame();
});
