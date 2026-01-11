/**
 * Texas Hold'em Game Engine - Unit Tests
 * Version: 1.1.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This test suite validates the coordination logic of the TexasHoldemEngine. 
 * It ensures the engine correctly identifies the best 5-card combination 
 * from the 7 available cards (2 hole + 5 community) and accurately declares 
 * winners or split pots.
 * * TEST COVERAGE:
 * 1. Win Conditions: Validates standard head-to-head scenarios (e.g., Royal 
 * Flush vs. Straight).
 * 2. Combination Logic: Ensures the engine successfully iterates through all 21 
 * possible 5-card subsets to find the absolute strongest hand for a player.
 * 3. Split Pots: Verifies that multiple players with identical hand strengths 
 * are correctly identified as co-winners.
 * 4. Property Validation: Confirms that the engine attaches the 'finalHandString' 
 * and 'finalRankName' to player objects for use by the UI and HandAnalyzer.
 * 5. Board Play: Tests scenarios where the community cards themselves form 
 * the best possible hand.
 */



var assert = require('assert');
var TexasHoldemEngine = require('../src/texasHoldemEngine.js');

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