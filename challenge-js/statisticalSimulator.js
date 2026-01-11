/**
 * Poker Statistical Simulator - Monte Carlo Method
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This tool runs millions of random trials to calculate the mathematical 
 * probability of hitting specific poker ranks. It serves as a validation 
 * tool for the PokerHand ranking logic.
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

    runSimulation(trials = 100000) {
        this.stats = {
            'Royal Flush': 0, 'Straight Flush': 0, 'Four of a Kind': 0,
            'Full House': 0, 'Flush': 0, 'Straight': 0, 
            'Three of a Kind': 0, 'Two Pair': 0, 'One Pair': 0, 'High Card': 0
        };

        console.log(`Starting simulation of ${trials.toLocaleString()} hands...`);

        for (let i = 0; i < trials; i++) {
            let deck = this.shuffle(this.generateDeck());
            let handString = deck.slice(0, 5).join(' ');
            let hand = new PokerHand(handString);
            let rank = hand.getRank();
            
            this.stats[rank]++;
        }

        this.displayResults(trials);
    }

    displayResults(trials) {
        console.log("\n--- SIMULATION RESULTS ---");
        for (let rank in this.stats) {
            let count = this.stats[rank];
            let percentage = ((count / trials) * 100).toFixed(4);
            console.log(`${rank.padEnd(16)}: ${count.toString().padStart(8)} | ${percentage}%`);
        }
        console.log("--------------------------\n");
    }
}

module.exports = StatisticalSimulator;