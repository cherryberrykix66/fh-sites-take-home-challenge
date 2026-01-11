/**
 * Poker Hand Ranker
 * * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This program evaluates a standard five-card poker hand and determines its 
 * highest possible rank based on standard Texas Hold'em rules.
 * * LOGIC & REASONING:
 * 1. Parsing: The input string is decomposed into numerical values and suit characters.
 * Face cards (J, Q, K, A) are normalized to integers (11-14) to facilitate math operations.
 * 2. Sorting: Card values are sorted in descending order. This allows the program to
 * detect sequences (Straights) and frequency groups (Pairs/Trips) more efficiently.
 * 3. Frequency Mapping: The program generates frequency maps for both values and suits.
 * By analyzing the distribution of these counts, it can instantly identify 
 * complex hands like Full Houses [3, 2] or Four of a Kind [4, 1].
 * 4. Hierarchy Evaluation: The program uses a "short-circuit" evaluation method, 
 * checking for the rarest/highest-value hands first (Royal Flush) and cascading 
 * down to the most common (High Card).
 * * FEATURES:
 * - Supports all standard poker ranks.
 * - Handles the "Wheel" straight edge case (Ace acting as low in A-2-3-4-5).
 * - Robust parsing for 2-character (As) and 3-character (10s) card representations.
 */

class PokerHand {
  constructor(handString) {
    this.handString = handString;
    
    // --- Parse the Hand ---
    // Split the string into individual cards
    this.cards = handString.split(' ');

    const valueMap = {
      '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
      'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    // Create two arrays: values (converted to numbers) and suits
    this.values = this.cards.map(card => valueMap[card.slice(0, -1)]);
    this.suits = this.cards.map(card => card.slice(-1));

    // --- Sort the Hand ---
    // Sort card values in descending order
    this.values.sort((a, b) => b - a);

    // --- Count Frequencies ---
    // Create maps to count value and suit frequencies
    this.valueCounts = {};
    this.values.forEach(v => this.valueCounts[v] = (this.valueCounts[v] || 0) + 1);
    
    this.suitCounts = {};
    this.suits.forEach(s => this.suitCounts[s] = (this.suitCounts[s] || 0) + 1);

    // Extract frequency numbers for easier rank checking (e.g., [2, 1, 1, 1] for a pair)
    this.counts = Object.values(this.valueCounts).sort((a, b) => b - a);
  }

  // --- Define Ranking Helper Functions ---
  
  isFlush() {
    // Are all 5 suits the same? (Only 1 unique suit in the map)
    return Object.keys(this.suitCounts).length === 1;
  }

  isStraight() {
    // Standard straight: 5 consecutive values
    const isStandard = this.values.every((val, i) => i === 0 || val === this.values[i - 1] - 1);
    
    // "Wheel" straight: A, 5, 4, 3, 2 (Logic: Values are [14, 5, 4, 3, 2])
    const isWheel = JSON.stringify(this.values) === JSON.stringify([14, 5, 4, 3, 2]);
    
    return isStandard || isWheel;
  }

  isFourOfAKind() { return this.counts[0] === 4; }
  
  isFullHouse() { return this.counts[0] === 3 && this.counts[1] === 2; }
  
  isThreeOfAKind() { return this.counts[0] === 3; }
  
  isTwoPair() { return this.counts[0] === 2 && this.counts[1] === 2; }
  
  isOnePair() { return this.counts[0] === 2; }

  // --- The "Tie-Breaker" Logic (Ranking Order) ---
  getRank() {
    const flush = this.isFlush();
    const straight = this.isStraight();

    // 1. Royal Flush: Straight + Flush + High card is Ace (14)
    if (straight && flush && this.values[0] === 14) return 'Royal Flush';
    
    // 2. Straight Flush: Straight + Flush
    if (straight && flush) return 'Straight Flush';
    
    // 3. Four of a Kind
    if (this.isFourOfAKind()) return 'Four of a Kind';
    
    // 4. Full House
    if (this.isFullHouse()) return 'Full House';
    
    // 5. Flush
    if (flush) return 'Flush';
    
    // 6. Straight
    if (straight) return 'Straight';
    
    // 7. Three of a Kind
    if (this.isThreeOfAKind()) return 'Three of a Kind';
    
    // 8. Two Pair
    if (this.isTwoPair()) return 'Two Pair';
    
    // 9. One Pair
    if (this.isOnePair()) return 'One Pair';
    
    // 10. High Card (Default)
    return 'High Card';
  }
}

module.exports = PokerHand;