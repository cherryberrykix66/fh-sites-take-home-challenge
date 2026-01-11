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
        this.hand = new PokerHand(handString);
        this.analysis = this.generateAnalysis();
    }

    generateAnalysis() {
        const rank = this.hand.getRank();
        const data = this.hand.getRankData();
        
        let advice = "";
        let description = `Your best hand is a ${rank}.`;

        // Educational Logic based on Rank Strength
        switch(data.strength) {
            case 9: // Royal Flush
            case 8: // Straight Flush
                advice = "This is an unbeatable monster hand. Bet for maximum value!";
                break;
            case 7: // Four of a Kind
            case 6: // Full House
                advice = "Extremely strong. You likely have the best hand.";
                break;
            case 5: // Flush
            case 4: // Straight
                advice = "Strong hand, but be cautious if the board shows pairs or higher suit possibilities.";
                break;
            case 2: // Two Pair
            case 1: // One Pair
                advice = "A moderate hand. Good for small pots, but be careful of heavy betting.";
                break;
            default:
                advice = "Very weak. You generally need a bluff or a fold here unless you have a strong 'draw'.";
        }

        return {
            rank: rank,
            strengthScore: data.strength,
            advice: advice,
            cardsUsed: this.hand.cards
        };
    }

    displayTrainerConsole() {
        console.log("--- POKER TRAINER ANALYSIS ---");
        console.log(`Hand: ${this.hand.handString}`);
        console.log(`Rank: ${this.analysis.rank}`);
        console.log(`Trainer Advice: ${this.analysis.advice}`);
        console.log("-------------------------------");
    }
}

module.exports = HandAnalyzer;