/**
 * Statistical Simulator - Unit Tests
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