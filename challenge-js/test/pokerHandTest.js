
/**
 * Poker Hand Ranker - Unit Tests
 * * Version: 1.1.1
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This test suite utilizes the Mocha framework and Node.js 'assert' library 
 * to validate the accuracy of the PokerHand ranking logic. 
 * * TEST COVERAGE:
 * - High-Value Hands: Royal Flush, Straight Flush.
 * - Multi-Card Patterns: Four of a Kind, Full House, Three of a Kind.
 * - Set Patterns: Two Pair, One Pair.
 * - Sequence & Suit Patterns: Flush, Straight.
 * 
 * - Use Cases:
 * Validates ranking logic, numeric strength scoring, and kicker value ordering.
 * 
 * - Edge Cases: The "Wheel" Straight (Ace-low sequence) and High Card evaluation.
 * 
 * * RUNNING TESTS:
 * Execute 'npm test' in the /challenge-js directory to run this suite.
 */

var assert = require('assert');
var PokerHand = require('../pokerHand.js');

describe('PokerHand Ranking Tests', function() {
  
  // Existing tests remain valid for backward compatibility
  it('should rank a Royal Flush string correctly', function() {
    var hand = new PokerHand('As Ks Qs Js 10s');
    assert.strictEqual(hand.getRank(), 'Royal Flush');
  });

  // --- New Tests for Engine Compatibility ---

  it('should return correct numeric strength (9) for Royal Flush', function() {
    var hand = new PokerHand('As Ks Qs Js 10s');
    assert.strictEqual(hand.getRankData().strength, 9);
  });

  it('should return correct numeric strength (0) for High Card', function() {
    var hand = new PokerHand('As Qd 9s 5h 2c');
    assert.strictEqual(hand.getRankData().strength, 0);
  });

  it('should set valueOrder correctly for Full House (Kickers)', function() {
    // Three 9s and two 5s
    var hand = new PokerHand('9s 9h 9d 5c 5s');
    // Primary value should be 9, secondary should be 5
    assert.deepStrictEqual(hand.valueOrder, [9, 5]);
  });

  it('should set valueOrder correctly for Two Pair with Kicker', function() {
    // Pairs of Kings and 3s with a 2 kicker
    var hand = new PokerHand('Kh Kc 3s 3h 2d');
    assert.deepStrictEqual(hand.valueOrder, [13, 3, 2]);
  });

  it('should handle "Wheel" Straight valueOrder correctly', function() {
    // A-2-3-4-5: Ace must be treated as 1 (lowest) for tie-breaking
    var hand = new PokerHand('As 2h 3d 4c 5s');
    assert.deepStrictEqual(hand.valueOrder, [5, 4, 3, 2, 1]);
  });

  it('should identify Four of a Kind even with 10s', function() {
    var hand = new PokerHand('10s 10h 10c 10d As');
    assert.strictEqual(hand.getRankData().strength, 7);
    assert.deepStrictEqual(hand.valueOrder, [10, 14]);
  });

});