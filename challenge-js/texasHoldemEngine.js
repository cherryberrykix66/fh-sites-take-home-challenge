
/**
 * Texas Hold'em Game Engine
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This engine serves as the coordinator for a Texas Hold'em round. It manages 
 * the relationship between community cards and player hole cards to determine 
 * the winning hand(s) based on standard 7-card poker rules.
 * * LOGIC & REASONING:
 * 1. Combination Generation: The engine utilizes a recursive helper function 
 * to identify all 21 possible 5-card combinations from a player's 7-card pool 
 * (2 hole cards + 5 community cards).
 * 2. Hand Evaluation: Each combination is instantiated via the PokerHand class, 
 * leveraging its internal ranking and numeric strength scoring.
 * 3. Best Hand Selection: For each player, the engine iterates through all 
 * combinations to isolate the single highest-ranking 5-card hand.
 * 4. Winner Determination: The engine compares the best hands of all participating 
 * players using a hierarchical rankOrder to declare a winner or a split pot.
 * * FEATURES:
 * - 7-Card Support: Implements the "best 5 of 7" rule essential for Texas Hold'em.
 * - Multi-Player Handling: Capable of evaluating and comparing any number of 
 * player hands simultaneously.
 * - Tie/Split Pot Detection: Correctly identifies scenarios where multiple players 
 * share the same winning rank.
 * - Modular Integration: Designed to work seamlessly with the PokerHand 
 * evaluation logic.
 */



// Helper to get all combinations of 5 from an array of 7
function getCombinations(cards, size) {
    let results = [];
    function helper(start, combo) {
        if (combo.length === size) {
            results.push(combo.join(' '));
            return;
        }
        for (let i = start; i < cards.length; i++) {
            helper(i + 1, [...combo, cards[i]]);
        }
    }
    helper(0, []);
    return results;
}

const PokerHand = require('./pokerHand.js');

class TexasHoldemEngine {
    constructor(communityCards, players) {
        this.communityCards = communityCards; // Array: ['7s', '8s', '9s', '10s', '2h']
        this.players = players; // Array of objects: [{ name: 'Alice', holeCards: ['As', 'Ks'] }]
    }

    determineWinner() {
        let bestOverallRank = -1;
        let winners = [];

        // Rank names in order of strength for comparison
        const rankOrder = [
            'High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 
            'Straight', 'Flush', 'Full House', 'Four of a Kind', 
            'Straight Flush', 'Royal Flush'
        ];

        this.players.forEach(player => {
            const allSevenCards = [...player.holeCards, ...this.communityCards];
            const combos = getCombinations(allSevenCards, 5);
            
            let playerBestRankIndex = -1;

            combos.forEach(combo => {
                const hand = new PokerHand(combo);
                const rankName = hand.getRank();
                const rankIndex = rankOrder.indexOf(rankName);
                
                if (rankIndex > playerBestRankIndex) {
                    playerBestRankIndex = rankIndex;
                }
            });

            player.finalRankIndex = playerBestRankIndex;
            player.finalRankName = rankOrder[playerBestRankIndex];

            if (playerBestRankIndex > bestOverallRank) {
                bestOverallRank = playerBestRankIndex;
                winners = [player];
            } else if (playerBestRankIndex === bestOverallRank) {
                winners.push(player); // Potential tie
            }
        });

        return winners;
    }
}

module.exports = TexasHoldemEngine;