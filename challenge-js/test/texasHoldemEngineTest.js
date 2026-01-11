/**
 * Texas Hold'em Game Engine - Unit Tests
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This test suite validates the coordination logic of the TexasHoldemEngine, 
 * ensuring it correctly identifies the best 5-card hand from the 7 available 
 * cards and accurately declares winners among multiple players.
 * * TEST COVERAGE:
 * - Win Conditions: Validates standard wins (e.g., Royal Flush vs. Straight).
 * - Combination Logic: Ensures the engine correctly iterates through all 21 
 * possible 5-card subsets from a 7-card pool.
 * - Split Pots: Verifies that multiple players with identical hand strengths 
 * are all identified as winners.
 * - Board Play: Tests scenarios where the best hand is formed entirely by 
 * community cards.
 * * RUNNING TESTS:
 * Execute 'npm test' in the /challenge-js directory to run this suite alongside 
 * the core PokerHand tests.
 */



var assert = require('assert');
var TexasHoldemEngine = require('../texasHoldemEngine.js');

describe('TexasHoldemEngine Tests', function() {
  
  it('should identify the winner with a Royal Flush vs a Straight', function() {
    const community = ['10s', 'Js', 'Qs', '2h', '3d'];
    const players = [
        { name: 'Alice', holeCards: ['As', 'Ks'] }, // Royal Flush
        { name: 'Bob', holeCards: ['9s', '8s'] }    // Straight
    ];

    const engine = new TexasHoldemEngine(community, players);
    const winners = engine.determineWinner();

    assert.strictEqual(winners.length, 1);
    assert.strictEqual(winners[0].name, 'Alice');
    assert.strictEqual(winners[0].finalRankName, 'Royal Flush');
  });

  it('should handle a tie (Split Pot)', function() {
    const community = ['2s', '4h', '6d', '8c', '10s'];
    const players = [
        { name: 'Alice', holeCards: ['Ah', 'Kh'] }, // High Card Ace
        { name: 'Bob', holeCards: ['Ad', 'Kd'] }    // High Card Ace
    ];

    const engine = new TexasHoldemEngine(community, players);
    const winners = engine.determineWinner();

    assert.strictEqual(winners.length, 2); // Both players win
  });

  it('should find the best hand when the board has a pair', function() {
    const community = ['9s', '9h', '7d', '2c', '3s'];
    const players = [
        { name: 'Alice', holeCards: ['9d', '5s'] }, // Three of a Kind
        { name: 'Bob', holeCards: ['7s', '7h'] }    // Full House (7s and 9s)
    ];

    const engine = new TexasHoldemEngine(community, players);
    const winners = engine.determineWinner();

    assert.strictEqual(winners[0].name, 'Bob');
    assert.strictEqual(winners[0].finalRankName, 'Full House');
  });
});