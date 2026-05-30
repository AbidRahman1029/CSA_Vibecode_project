# � Cursor Casino - Multi-Game Platform

A professional, web-based casino gaming platform featuring multiple classic card and table games with beautiful UI, realistic gameplay mechanics, and persistent chip management.

## 🎮 Games Included

### 🃏 **Texas Hold'em Poker**
A sophisticated Texas Hold'em poker game with professional-level AI powered by the PokerStars API.

**Features:**
- Professional AI opponent with strategic decision-making
- Real-time API-powered decisions based on poker theory
- Hand strength evaluation, pot odds, and position analysis
- Fallback AI for offline play
- Complete betting rounds and showdown mechanics
- Beautiful responsive UI with card animations

**Game Controls:**
- Deal Cards, Check, Call, Raise, All In, Fold
- Real-time pot tracking and chip management
- Hand history and game log

---

### 🎰 **American Roulette**
A fully featured American Roulette game with realistic wheel mechanics and comprehensive betting options.

**Features:**
- Authentic 37-number wheel (0-36) with red/black/green coloring
- Animated spinning wheel with realistic ball mechanics
- Inside bets: Straight numbers (36:1 payout)
- Outside bets: Dozens, Columns, High/Low, Even/Odd, Red/Black
- Visual betting board matching professional roulette layouts
- Real-time chip placement and bet tracking
- Last spin result display with game log

**Betting Options:**
- Straight Bets: Individual numbers
- Column Bets: 3 numbers per column (2:1)
- Dozen Bets: 1st/2nd/3rd 12 (3:1)
- Outside Bets: Red/Black, Odd/Even, High/Low (2:1)

---

### 🎴 **Blackjack**
Classic 21 card game with dealer AI and strategic gameplay.

**Features:**
- Standard blackjack rules and hand evaluation
- Dealer AI with configurable hit/stand strategy
- Split, Double Down, and Insurance options
- Real-time hand evaluation and outcome determination
- Game statistics and betting history

---

### 🎲 **Baccarat**
Elegant baccarat game with three betting options and quick-paced action.

**Features:**
- Player vs. Banker betting
- Natural and drawn hand mechanics
- Tie betting option
- Commission tracking on banker wins
- Automated card dealing and evaluation

---

## 💰 Shared Chip System

All games share a common chip balance stored in browser localStorage:
- Starting balance: **$1,000**
- Winnings and losses persist across games
- Navigate between games from the lobby
- Real-time chip display in each game header

---

## 🚀 Getting Started

### 1. Open the Lobby
Simply open `index.html` in your web browser to access the casino lobby.

### 2. Select a Game
Choose from Poker, Roulette, Blackjack, or Baccarat.

### 3. Place Bets & Play
Each game has intuitive controls and real-time feedback.

### 4. Track Winnings
Chips persist across all games via localStorage.

---

## 🔧 Setup for Poker (Professional AI)

To enable professional poker AI decisions via PokerStars API:

### 1. Get API Key
Visit [PokerStars Developer Portal](https://developers.pokerstars.com)
- Create an account
- Apply for API access
- Retrieve your API key

### 2. Configure in Script
In `script.js`, replace the placeholder:

```javascript
'Authorization': 'Bearer YOUR_ACTUAL_API_KEY_HERE'
```

### 3. Run the Game
Open `index.html` - professional AI is now active!

**Note:** If API is unavailable, poker falls back to basic AI logic automatically.

---

## 📁 Project Structure

```
poker/
├── index.html              # Casino lobby & game selector
├── poker.html              # Texas Hold'em game
├── blackjack.html          # Blackjack game
├── roulette.html           # American Roulette game
├── baccarat.html           # Baccarat game
├── script.js               # Shared utilities & poker logic
├── blackjack.js            # Blackjack game logic
├── roulette.js             # Roulette game logic
├── style.css               # Global styles for all games
└── README.md               # This file
```

---

## 🎯 Game Mechanics

### **Chip Management**
- All games share a unified chip balance
- Chips stored in browser localStorage (`casinoPlayerChips`)
- Automatic updates across all game instances
- Reset by clearing browser storage

### **Betting System**
- Each game has minimum/maximum bet limits
- Real-time bet validation
- Visual chip placement feedback
- Hover previews before placing bets

### **Game Flow**
1. Select game from lobby
2. Set bet amount
3. Place bets according to game rules
4. Execute game action (spin wheel, deal cards, etc.)
5. Automatic payout calculation
6. Return to lobbby or play again

---

## 🎨 Design Features

- **Professional Styling**: Modern, responsive design with gradients and shadows
- **Card Animations**: Smooth dealing and flip animations
- **Real-time Feedback**: Immediate visual confirmation of actions
- **Game Logs**: Timestamped event tracking
- **Color-Coded Elements**: Intuitive visual hierarchy
- **Mobile Responsive**: Adapts to all screen sizes

---

## 🔐 Data Persistence

- **localStorage**: Chip balance persists between sessions
- **Session Data**: Game history stored during active session
- **No Server Required**: Fully client-side operation

---

## 🛠️ Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## 📝 License

Free to use and modify for personal projects.

---

## 🎓 About

Cursor Casino is a demonstration of:
- Advanced JavaScript game mechanics
- DOM manipulation and event handling
- CSS animations and responsive design
- Browser storage and state management
- Professional UI/UX principles

### **Fallback AI:**
- Modify `fallbackAIDecision()` for custom logic
- Adjust hand strength thresholds
- Customize betting aggression levels

## 📱 Browser Compatibility

- **Chrome**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support
- **Edge**: ✅ Full support
- **Mobile**: ✅ Responsive design

## 🎯 Pro Tips

1. **Study the AI's decisions** - Learn from professional strategies
2. **Watch betting patterns** - Understand position and stack management
3. **Analyze showdowns** - See how the AI evaluates hands
4. **Use the fallback mode** - Practice against basic AI when offline

## 🔒 Security Notes

- **API keys are client-side** - Use HTTPS in production
- **Rate limiting** - Respect API usage limits
- **Error handling** - Graceful fallback on API failures

## 🚀 Future Enhancements

- **Multiplayer support** with WebSocket APIs
- **Tournament mode** with bracket systems
- **Statistics tracking** and hand analysis
- **Custom AI training** with machine learning
- **Mobile app** with React Native

## 📞 Support

For API issues:
- **PokerStars Developer Support**: [support@pokerstars.com](mailto:support@pokerstars.com)
- **API Documentation**: [docs.pokerstars.com](https://docs.pokerstars.com)

For game issues:
- Check the browser console for errors
- Verify API key configuration
- Ensure internet connectivity

---

**Enjoy playing against a professional-level poker AI! 🎯🃏**
