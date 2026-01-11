/**
 * Poker Hand Analyzer - Educational Tool
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * An educational wrapper for the PokerHand class designed to help beginners
 * understand hand strength and poker theory.
 */

const PokerHand = require('./pokerHand.js');

class HandAnalyzer {
    constructor(handString) {
        // Defensive check: if handString is missing, use a placeholder
        // const safeString = handString || "2s 3s 4s 5s 7h"; 
        // Remove the "2s 3s 4s 5s 7h" fallback to see real errors
    if (!handString) {
        console.error("HandAnalyzer received an empty hand string!");
    }
    this.hand = new PokerHand(handString || ""); 
    this.analysis = this.generateAnalysis();
    this.displayTrainerConsole();
    }

generateAnalysis() {
    const rank = this.hand.getRank();
    const data = this.hand.getRankData();
    
    let advice = "";
    // FORCE numeric conversion to prevent type-mismatch bugs
    const strength = Number(data.strength); 

    // NEW: Explicitly handle empty or invalid hand strings
    if (!this.hand.handString || this.hand.handString.trim() === "") {
        return {
            rank: "N/A",
            strengthScore: 0,
            advice: "No cards detected to analyze.",
            cardsUsed: []
        };
    }

    switch(strength) {
        case 9: 
        case 8: // Straight Flush
            advice = "This is an unbeatable monster hand. Bet for maximum value!";
            break;
        case 7: 
        case 6: // Full House
            advice = "Extremely strong. You likely have the best hand.";
            break;
        case 5: // Flush
        case 4: // Straight
            // FIX: Ensure this string contains 'be cautious' exactly for the unit test
            advice = "Strong hand, but be cautious if the board shows pairs or higher suit possibilities.";
            break; 
        case 3: // Three of a Kind
            advice = "Solid hand. Three of a kind is often a winner.";
            break;
        case 2: 
        case 1: // Pair
            advice = "A moderate hand. Good for small pots, but be careful of heavy betting.";
            break;
        default:
            advice = "Very weak. You generally need a bluff or a fold here unless you have a strong 'draw'.";
    }

    return {
        rank: rank,
        strengthScore: strength,
        advice: advice,
        cardsUsed: this.hand.cards
    };
}

    displayTrainerConsole() {
        console.log("%c--- POKER TRAINER DEBUG ---", "color: #00ff00; font-weight: bold;");
        console.log(`Hand String: "${this.hand.handString}"`);
        console.log(`Detected Rank: ${this.analysis.rank}`);
        console.log(`Strength Value: ${this.analysis.strengthScore} (Type: ${typeof this.analysis.strengthScore})`);
        console.log(`Generated Advice: ${this.analysis.advice}`);
        console.log("-------------------------------");
    }

    
}

module.exports = HandAnalyzer;