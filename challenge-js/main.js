const TexasHoldemEngine = require('./texasHoldemEngine.js');
const StatisticalSimulator = require('./statisticalSimulator.js');

// Helper to deal a random deck
function dealNewDeck() {
    const s = ['s','h','d','c'], v = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
    let d = []; s.forEach(si => v.forEach(vi => d.push(vi+si)));
    for (let i = d.length-1; i > 0; i--) { 
        const j = Math.floor(Math.random()*(i+1)); 
        [d[i], d[j]] = [d[j], d[i]]; 
    }
    return d;
}

// EXPOSE TO BROWSER
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

window.runSimulation = function(trials) {
    const sim = new StatisticalSimulator();
    // Assuming your simulator has a method that returns a string or object for the UI
    sim.runSimulation(trials); 
    return `Simulation of ${trials} hands complete. Check console for details.`;
};