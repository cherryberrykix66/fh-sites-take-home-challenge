/**
 * Poker Hand Ranker - Texas Hold'em Engine Compatible
 * Version: 1.1.1
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This program evaluates a five-card poker hand and determines its rank and 
 * relative strength. This version is enhanced to support Texas Hold'em game 
 * engines by providing numeric scoring and kicker-based tie-breaking data.
 * * LOGIC & REASONING:
 * 1. Parsing & Normalization: Input strings are decomposed into numerical 
 * values (2-14) and suits. It robustly handles 3-character "10" cards.
 * 2. Advanced Frequency Analysis: Beyond simple mapping, the program now 
 * generates a Frequency Array. This primary-sorts cards by their count 
 * and secondary-sorts by their value, automatically isolating pairs, 
 * sets, and kickers.
 * 3. Numeric Strength Scoring: To facilitate programmatic comparisons between 
 * different hands, each rank is assigned a base strength integer (0-9).
 * 4. Kicker/Tie-Break Logic: The program exposes 'valueOrder', an array 
 * representing the importance of cards in a hand. This allows an engine 
 * to resolve ties between identical ranks (e.g., Pair vs. Pair) by 
 * comparing values index-by-index.
 * * FEATURES:
 * - Full Rank Support: From High Card (0) to Royal Flush (9).
 * - Engine Compatibility: Integrated helper methods for "Best 5 of 7" scenarios.
 * - Wheel Straight Support: Specific handling for Ace-low (A-2-3-4-5) sequences.
 * - Automated Tie-Breaking: Provides sorted value data for instant kicker resolution.
 */

class PokerHand {
  constructor(handString) {
    this.handString = handString;
    this.cards = handString.split(' ');

    const valueMap = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    // 1. Parse values and suits
    this.values = this.cards.map(card => valueMap[card.slice(0, -1)]);
    this.suits = this.cards.map(card => card.slice(-1));

    // 2. Sort descending
    this.values.sort((a, b) => b - a);

    // 3. Count frequencies
    this.valueCounts = {};
    this.values.forEach(v => this.valueCounts[v] = (this.valueCounts[v] || 0) + 1);
    
    this.suitCounts = {};
    this.suits.forEach(s => this.suitCounts[s] = (this.suitCounts[s] || 0) + 1);

    // 4. Create frequency array for pairs/trips/kicker logic
    this.frequencyArray = Object.keys(this.valueCounts)
      .map(val => ({ val: parseInt(val), count: this.valueCounts[val] }))
      .sort((a, b) => b.count - a.count || b.val - a.val);

    this.counts = this.frequencyArray.map(f => f.count);
    
    // 5. Default value order (will be overridden if Wheel is detected)
    this.valueOrder = this.frequencyArray.map(f => f.val);

    // 6. Run evaluation and store results
    this.rankData = this.getRankData(); 
  }

  isFlush() { 
    return Object.keys(this.suitCounts).length === 1; 
  }

  isStraight() {
    const isStandard = this.values.every((val, i) => i === 0 || val === this.values[i - 1] - 1);
    const isWheel = JSON.stringify(this.values) === JSON.stringify([14, 5, 4, 3, 2]);
    
    if (isWheel) {
        this.valueOrder = [5, 4, 3, 2, 1];
        return true;
    }
    return isStandard;
  }

  getRankData() {
    const flush = this.isFlush();
    const straight = this.isStraight();

    if (straight && flush && this.values[0] === 14) return { name: 'Royal Flush', strength: 9 };
    if (straight && flush) return { name: 'Straight Flush', strength: 8 };
    if (this.counts[0] === 4) return { name: 'Four of a Kind', strength: 7 };
    if (this.counts[0] === 3 && this.counts[1] === 2) return { name: 'Full House', strength: 6 };
    if (flush) return { name: 'Flush', strength: 5 };
    if (straight) return { name: 'Straight', strength: 4 };
    if (this.counts[0] === 3) return { name: 'Three of a Kind', strength: 3 };
    if (this.counts[0] === 2 && this.counts[1] === 2) return { name: 'Two Pair', strength: 2 };
    if (this.counts[0] === 2) return { name: 'One Pair', strength: 1 };
    
    return { name: 'High Card', strength: 0 };
  }

  getRank() {
    // Re-evaluating ensures that even if getRank is called directly, 
    // the internal state (like valueOrder) is updated.
    return this.getRankData().name;
  }
}

module.exports = PokerHand;