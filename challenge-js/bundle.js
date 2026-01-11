(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

    // Guard clause for invalid hands
    if (strength === -1 || !this.hand.handString) {
        return { rank: "N/A", strengthScore: 0, advice: "No cards detected to analyze." };
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
            // This exact phrase is required to pass your unit test
            advice = "Strong hand, but be cautious if the board shows pairs.";
            break;
        case 3:
            advice = "Solid hand with Three of a Kind.";
            break;
        case 2: case 1:
            advice = "A moderate hand. Good for small pots.";
            break;
        default:
            advice = "Very weak. You generally need a bluff or a fold here.";
    }

    return {
        rank: rank,
        strengthScore: strength,
        advice: advice
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
},{"./pokerHand.js":3}],2:[function(require,module,exports){
/**
 * @file main.js
 * @package Poker Tool Suite
 * @version 1.1.1
 * @author Jenna James
 * * @description 
 * Core entry point for the Poker Tool Suite web application. This script 
 * orchestrates the interaction between the TexasHoldemEngine (game logic) 
 * and the StatisticalSimulator (probability logic). 
 * * @notes
 * - This file is intended to be bundled via Browserify: 
 * `browserify src/main.js -o bundle.js`
 * - Functions are explicitly attached to the `window` object to ensure
 * availability in the global browser scope after bundling.
 * - Implements requestAnimationFrame for the simulator to maintain a
 * responsive UI (60fps) during heavy Monte Carlo computations.
 * * @dependencies
 * - ./texasHoldemEngine.js   : Handles 7-card best-hand evaluation.
 * - ./statisticalSimulator.js: Manages probability math and HTML table generation.
 * - ./pokerHand.js           : Basic 5-card parsing and ranking.
 * - ./handAnalyzer.js        : Provides educational advice based on hand strength.
 */

const TexasHoldemEngine = require('./texasHoldemEngine.js');
const StatisticalSimulator = require('./statisticalSimulator.js');
const PokerHand = require('./pokerHand.js');
const HandAnalyzer = require('./handAnalyzer.js');

/**
 * Generates a standard 52-card deck and performs a Fisher-Yates shuffle.
 * @returns {string[]} An array of shuffled card strings (e.g., ["As", "10h"]).
 */
function dealNewDeck() {
    const s = ['s','h','d','c'], v = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    let d = []; 
    s.forEach(si => v.forEach(vi => d.push(vi+si)));
    for (let i = d.length-1; i > 0; i--) { 
        const j = Math.floor(Math.random()*(i+1)); 
        [d[i], d[j]] = [d[j], d[i]]; 
    }
    return d;
}

/**
 * Handles the "Quick Play" feature.
 * Deals cards to two players and the board, then determines the winner.
 * @exposed window.playRound
 */
window.playRound = function() {
    const deck = dealNewDeck();
    const aliceHole = [deck.pop(), deck.pop()];
    const bobHole = [deck.pop(), deck.pop()];
    const community = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];

    const players = [
        { name: 'Alice', holeCards: aliceHole },
        { name: 'Bob', holeCards: bobHole }
    ];

    const engine = new TexasHoldemEngine(community, players);
    const winners = engine.determineWinner();

    // MATCH THESE NAMES EXACTLY to avoid ReferenceErrors in the UI
    const aliceData = engine.players.find(p => p.name === 'Alice');
    const bobData = engine.players.find(p => p.name === 'Bob');

    // Initialize the HandAnalyzer with the best 5-card hand string generated by the engine
    const aliceAnalysis = new HandAnalyzer(aliceData.finalHandString || "");
    const bobAnalysis = new HandAnalyzer(bobData.finalHandString || "");

    let winnerText = winners.length > 1 ? "Split Pot!" : `${winners[0].name} Wins!`;

    return {
        community,
        players: [
            { ...aliceData, analysis: aliceAnalysis.analysis },
            { ...bobData, analysis: bobAnalysis.analysis }
        ],
        winnerText
    };
};

/**
 * Runs a Monte Carlo simulation for poker hand frequencies.
 * Uses iterative "chunking" to prevent blocking the browser's main thread.
 * * @param {number} totalTrials - Number of hands to simulate.
 * @param {function} updateCallback - Function to call with (progressPercentage, resultsHTML).
 * @exposed window.runSimulationIterative
 */
window.runSimulationIterative = function(totalTrials, updateCallback) {
    const sim = new StatisticalSimulator();
    
    // Reset stats to zero for a clean simulation run
    sim.stats = {
        'Royal Flush': 0, 'Straight Flush': 0, 'Four of a Kind': 0,
        'Full House': 0, 'Flush': 0, 'Straight': 0, 
        'Three of a Kind': 0, 'Two Pair': 0, 'One Pair': 0, 'High Card': 0
    };

    let processed = 0;
    // Calculate chunk size to ensure the UI updates roughly 50 times
    const chunkSize = Math.max(1, Math.floor(totalTrials / 50));

    function step() {
        const target = Math.min(processed + chunkSize, totalTrials);
        
        for (let i = processed; i < target; i++) {
            let deck = sim.shuffle(sim.generateDeck());
            // Evaluate a random 5-card hand
            let hand = new PokerHand(deck.slice(0, 5).join(' '));
            sim.stats[hand.getRank()]++;
        }
        
        processed = target;
        const progress = (processed / totalTrials) * 100;
        
        if (processed < totalTrials) {
            // Update progress bar without injecting table yet
            updateCallback(progress, null);
            // Schedule the next chunk for the next animation frame
            requestAnimationFrame(step);
        } else {
            // Simulation complete: generate and return final HTML table
            const tableHTML = sim.generateHTMLResults(totalTrials);
            updateCallback(100, tableHTML);
        }
    }
    
    // Begin the first iteration
    step();
};
},{"./handAnalyzer.js":1,"./pokerHand.js":3,"./statisticalSimulator.js":4,"./texasHoldemEngine.js":5}],3:[function(require,module,exports){
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
  // Guard against empty strings to prevent "Ghost Straight Flush"
  if (!handString || handString.trim() === "") {
    this.cards = [];
    this.values = [];
    this.suits = [];
    this.rankData = { name: 'N/A', strength: -1 }; 
    return;
  }
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
},{}],4:[function(require,module,exports){
/**
 * Poker Statistical Simulator - Monte Carlo Method
 * Version: 1.1.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This tool runs random trials to calculate the mathematical probability 
 * of hitting specific poker ranks. Enhanced for Web UI compatibility.
 */

const PokerHand = require('./pokerHand.js');

class StatisticalSimulator {
    constructor() {
        this.suits = ['s', 'h', 'd', 'c'];
        this.values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        this.stats = {};
    }

    // Generate a fresh deck of 52 cards
    generateDeck() {
        let deck = [];
        for (let s of this.suits) {
            for (let v of this.values) {
                deck.push(v + s);
            }
        }
        return deck;
    }

    // Shuffle using Fisher-Yates algorithm
    shuffle(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    /**
     * Runs the simulation and returns a formatted HTML table for the Web UI.
     */
    runSimulation(trials = 100000) {
        this.stats = {
            'Royal Flush': 0, 'Straight Flush': 0, 'Four of a Kind': 0,
            'Full House': 0, 'Flush': 0, 'Straight': 0, 
            'Three of a Kind': 0, 'Two Pair': 0, 'One Pair': 0, 'High Card': 0
        };

        for (let i = 0; i < trials; i++) {
            let deck = this.shuffle(this.generateDeck());
            let handString = deck.slice(0, 5).join(' ');
            let hand = new PokerHand(handString);
            let rank = hand.getRank();
            
            this.stats[rank]++;
        }

        return this.generateHTMLResults(trials);
    }

    /**
     * Helper to generate a professional HTML table for browser rendering.
     */
    generateHTMLResults(trials) {
        let htmlTable = `
            <table style="width:100%; border-collapse: collapse; margin-top: 10px; color: white;">
                <thead>
                    <tr style="border-bottom: 2px solid #35654d; text-align: left;">
                        <th style="padding: 8px;">Rank</th>
                        <th style="padding: 8px;">Count</th>
                        <th style="padding: 8px;">Probability</th>
                    </tr>
                </thead>
                <tbody>`;

        for (let rank in this.stats) {
            let count = this.stats[rank];
            let percentage = ((count / trials) * 100).toFixed(4);
            htmlTable += `
                <tr style="border-bottom: 1px solid #444;">
                    <td style="padding: 8px;">${rank}</td>
                    <td style="padding: 8px;">${count.toLocaleString()}</td>
                    <td style="padding: 8px; color: #ffd700;">${percentage}%</td>
                </tr>`;
        }

        htmlTable += `</tbody></table>`;
        return htmlTable;
    }
}

module.exports = StatisticalSimulator;
},{"./pokerHand.js":3}],5:[function(require,module,exports){

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

    const rankOrder = [
        'High Card', 'One Pair', 'Two Pair', 'Three of a Kind', 
        'Straight', 'Flush', 'Full House', 'Four of a Kind', 
        'Straight Flush', 'Royal Flush'
    ];

    this.players.forEach(player => {
        const allSevenCards = [...player.holeCards, ...this.communityCards];
        const combos = getCombinations(allSevenCards, 5);
        
        let playerBestRankIndex = -1;
        let playerBestHandString = ""; // ADD THIS to track the actual cards

        combos.forEach(combo => {
            const hand = new PokerHand(combo);
            const rankName = hand.getRank();
            const rankIndex = rankOrder.indexOf(rankName);
            
            if (rankIndex > playerBestRankIndex) {
                playerBestRankIndex = rankIndex;
                playerBestHandString = combo; // CAPTURE the string here
            }
        });

        // SAVE the captured string so main.js can pass it to the analyzer
        player.finalRankIndex = playerBestRankIndex;
        player.finalRankName = rankOrder[playerBestRankIndex];
        player.finalHandString = playerBestHandString; // ADD THIS LINE

        if (playerBestRankIndex > bestOverallRank) {
            bestOverallRank = playerBestRankIndex;
            winners = [player];
        } else if (playerBestRankIndex === bestOverallRank) {
            winners.push(player);
        }
    });

    return winners;
}
}

module.exports = TexasHoldemEngine;
},{"./pokerHand.js":3}]},{},[2]);
