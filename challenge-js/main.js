/**
 * Poker Tool Suite - Main Entry Point (Web Bundle)
 * Version: 1.1.0
 * Author: Jenna James
 */

const TexasHoldemEngine = require('./texasHoldemEngine.js');
const StatisticalSimulator = require('./statisticalSimulator.js');
const PokerHand = require('./pokerHand.js');

// Helper to deal a random deck
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

// EXPOSE PLAY ROUND TO WINDOW
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

    let winnerText = winners.length > 1 
        ? "Split Pot!" 
        : `${winners[0].name} Wins!`;

    return {
        community,
        players,
        winnerText
    };
};

// EXPOSE ITERATIVE SIMULATION TO WINDOW
window.runSimulationIterative = function(totalTrials, updateCallback) {
    const sim = new StatisticalSimulator();
    // Initialize stats manually to ensure we start fresh
    sim.stats = {
        'Royal Flush': 0, 'Straight Flush': 0, 'Four of a Kind': 0,
        'Full House': 0, 'Flush': 0, 'Straight': 0, 
        'Three of a Kind': 0, 'Two Pair': 0, 'One Pair': 0, 'High Card': 0
    };

    let processed = 0;
    const chunkSize = Math.max(1, Math.floor(totalTrials / 50)); // Update bar 50 times

    function step() {
        const target = Math.min(processed + chunkSize, totalTrials);
        
        for (let i = processed; i < target; i++) {
            let deck = sim.shuffle(sim.generateDeck());
            let hand = new PokerHand(deck.slice(0, 5).join(' '));
            sim.stats[hand.getRank()]++;
        }
        
        processed = target;
        const progress = (processed / totalTrials) * 100;
        
        if (processed < totalTrials) {
            updateCallback(progress, null);
            // requestAnimationFrame tells the browser to update the UI before the next chunk
            requestAnimationFrame(step);
        } else {
            const tableHTML = sim.generateHTMLResults(totalTrials);
            updateCallback(100, tableHTML);
        }
    }
    
    step();
};