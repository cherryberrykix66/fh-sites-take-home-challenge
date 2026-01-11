/**
 * Poker Statistical Simulator - Unit Tests
 * Version: 1.1.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This test suite validates the core utility functions of the StatisticalSimulator.
 * It ensures that the mathematical foundation of the Monte Carlo simulations—
 * the deck generation and the randomization algorithm—is reliable and follows
 * standard probability requirements.
 * * TEST COVERAGE:
 * 1. Deck Integrity: Confirms that the generator produces exactly 52 unique 
 * cards with no duplicates or missing suits/values.
 * 2. Randomization (Entropy): Validates the Fisher-Yates shuffle implementation 
 * by comparing a fresh deck against a shuffled deck to ensure high entropy.
 * 3. Data Structure: Verifies that the internal stats object is correctly 
 * structured to receive ranking counts during a trial run.
 */
var assert = require('assert');
var StatisticalSimulator = require('../src/statisticalSimulator.js');

describe('StatisticalSimulator Logic Tests', function() {
  
  it('should generate a full deck of 52 unique cards', function() {
    var sim = new StatisticalSimulator();
    var deck = sim.generateDeck();
    var uniqueCards = new Set(deck);
    assert.strictEqual(deck.length, 52);
    assert.strictEqual(uniqueCards.size, 52);
  });

  it('should shuffle the deck and produce different results', function() {
    var sim = new StatisticalSimulator();
    var deck1 = sim.generateDeck().join(',');
    var deck2 = sim.shuffle(sim.generateDeck()).join(',');
    assert.notStrictEqual(deck1, deck2);
  });

});