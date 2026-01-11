/**
 * Poker Tool Suite - Main Entry Point
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This is the central hub for the Poker Hand project. It provides access to
 * the Texas Hold'em Engine, the Hand Analyzer (Trainer), and the
 * Statistical Simulator.
 */

const TexasHoldemEngine = require('./texasHoldemEngine.js');
const HandAnalyzer = require('./handAnalyzer.js');
const StatisticalSimulator = require('./statisticalSimulator.js');

const args = process.argv.slice(2);
const command = args[0];

console.log("========================================");
console.log("      JENNA'S POKER TOOL SUITE          ");
console.log("========================================\n");

switch (command) {
    case 'train':
        // Usage: node main.js train "As Ks Qs Js 10s"
        const handInput = args[1] || 'As Ks Qs Js 10s';
        const trainer = new HandAnalyzer(handInput);
        trainer.displayTrainerConsole();
        break;

    case 'simulate':
        // Usage: node main.js simulate 100000
        const trials = parseInt(args[1]) || 50000;
        const sim = new StatisticalSimulator();
        sim.runSimulation(trials);
        break;

case 'play':
        // 1. Initialize the deck using the Simulator's logic
        const dealer = new StatisticalSimulator();
        let deck = dealer.shuffle(dealer.generateDeck());

        // 2. Deal 2 cards to each player and 5 to the board
        const aliceHole = [deck.pop(), deck.pop()];
        const bobHole = [deck.pop(), deck.pop()];
        const community = [deck.pop(), deck.pop(), deck.pop(), deck.pop(), deck.pop()];

        const players = [
            { name: 'Alice', holeCards: aliceHole },
            { name: 'Bob', holeCards: bobHole }
        ];

        // 3. Run the engine with the randomized cards
        const engine = new TexasHoldemEngine(community, players);
        const winners = engine.determineWinner();

        console.log("Texas Hold'em Round Results:");
        console.log("----------------------------");
        console.log(`Board:   ${community.join(' ')}`);
        console.log(`Alice:   ${aliceHole.join(' ')} (${players[0].finalRankName})`);
        console.log(`Bob:     ${bobHole.join(' ')} (${players[1].finalRankName})`);
        console.log("----------------------------");

        if (winners.length > 1) {
            console.log(`Result:  Split Pot! Both players have ${winners[0].finalRankName}`);
        } else {
            console.log(`Winner:  ${winners[0].name} with a ${winners[0].finalRankName}!`);
        }
        break;

    default:
        console.log("Usage Instructions:");
        console.log("  node main.js train \"[hand]\"   - Analyze a specific hand");
        console.log("  node main.js simulate [n]    - Run n random trials");
        console.log("  node main.js play            - Run a sample game engine round");
        break;
}

console.log("\n========================================");