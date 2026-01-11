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