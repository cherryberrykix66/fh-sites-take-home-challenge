/**
 * @file main.js
 * @package Poker Tool Suite
 * @version 1.1.0
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
// Update your window.playRound function
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

    // MATCH THESE NAMES EXACTLY
    const aliceData = engine.players.find(p => p.name === 'Alice');
    const bobData = engine.players.find(p => p.name === 'Bob');

    // Pass the actual finalHandString to the analyzer
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