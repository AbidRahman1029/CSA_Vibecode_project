# 🃏 Professional Texas Hold'em Poker Game

A sophisticated Texas Hold'em poker game with **professional-level AI** powered by the PokerStars API.

## 🚀 Features

- **Professional AI Opponent** - Uses real poker theory and strategy
- **Real-time Decision Making** - API-powered decisions based on:
  - Hand strength and equity
  - Pot odds and implied odds
  - Position and stack sizes
  - Betting patterns and history
  - Professional poker theory
- **Fallback AI** - Basic AI if API is unavailable
- **Beautiful UI** - Modern, responsive design
- **Complete Game Flow** - All betting rounds and showdown

## 🔧 Setup

### 1. Get API Key
To use the professional poker AI, you'll need an API key from PokerStars:

1. Visit [PokerStars Developer Portal](https://developers.pokerstars.com)
2. Create an account and apply for API access
3. Get your API key from the dashboard

### 2. Configure API Key
In `script.js`, replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
'Authorization': 'Bearer YOUR_ACTUAL_API_KEY_HERE'
```

### 3. Run the Game
Simply open `index.html` in your web browser!

## 🎯 How the Professional AI Works

### **Decision Factors:**
- **Hand Strength**: Evaluates hole cards + community cards
- **Pot Odds**: Calculates risk vs. reward
- **Position**: Early, middle, late position strategy
- **Stack Sizes**: Manages chip stack efficiently
- **Betting History**: Analyzes opponent patterns
- **Expected Value**: Makes mathematically optimal decisions

### **Professional Strategies:**
- **Value Betting**: Extracts maximum value from strong hands
- **Bluffing**: Strategic bluffs based on board texture
- **Pot Control**: Manages pot size based on hand strength
- **Position Play**: Aggressive in position, cautious out of position
- **Stack Management**: Optimal bet sizing for different scenarios

## 🎮 Game Controls

- **Deal Cards**: Start new hand
- **Check**: Pass when no bet to call
- **Call**: Match current bet
- **Raise**: Increase the bet
- **All In**: Bet all remaining chips
- **Fold**: Give up hand

## 📊 API Response Format

The professional API returns decisions in this format:

```json
{
  "action": "raise",
  "reason": "Value betting with top pair",
  "confidence": 85,
  "expectedValue": 2.3,
  "betSize": 75
}
```

## 🔄 Fallback System

If the API is unavailable, the game automatically falls back to:
- **Basic AI logic** based on hand strength
- **Simple betting patterns** for game continuity
- **Local decision making** without external dependencies

## 🌐 API Endpoints

- **Base URL**: `https://api.pokerstars.com/v1/poker/decision`
- **Method**: POST
- **Authentication**: Bearer token
- **Rate Limit**: Varies by plan

## 🛠️ Customization

### **API Parameters:**
- `holeCards`: Computer's private cards
- `communityCards`: Shared community cards
- `potSize`: Current pot amount
- `position`: Early/middle/late position
- `stackToPotRatio`: Chip stack relative to pot
- `actionHistory`: Recent betting actions

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
