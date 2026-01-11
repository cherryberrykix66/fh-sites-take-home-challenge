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
    const strength = Number(data.strength);

    // Guard for invalid hands (e.g., from an empty string)
    if (strength === -1 || !this.hand.handString || this.hand.handString.trim() === "") {
        return {
            rank: "N/A",
            strengthScore: 0,
            advice: "No cards detected to analyze.",
            cardsUsed: [] // FIX: Test requires .length, so provide an empty array
        };
    }

    let advice = "";
    switch(strength) {
        case 9: case 8:
            advice = "This is an unbeatable monster hand. Bet for maximum value!";
            break;
        case 7: case 6:
            advice = "Extremely strong. You likely have the best hand.";
            break;
        case 5:
            advice = "Strong hand with a Flush.";
            break;
        case 4: 
            // EXACT MATCH for your failing 'caution' test
            advice = "Strong hand, but be cautious if the board shows pairs.";
            break;
        case 3:
            advice = "Solid hand with Three of a Kind.";
            break;
        case 2: case 1:
            advice = "A moderate hand. Good for small pots.";
            break;
        default:
            // EXACT MATCH for your 'bluff or fold' test
            advice = "Very weak. You generally need a bluff or a fold here.";
    }

    return {
        rank: rank,
        strengthScore: strength,
        advice: advice,
        cardsUsed: this.hand.cards // FIX: Ensures the test can read .length
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