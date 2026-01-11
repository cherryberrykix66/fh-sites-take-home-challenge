
/**
 * Poker Hand Ranker - Unit Tests
 * * Version: 1.0.0
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
 * - Edge Cases: The "Wheel" Straight (Ace-low sequence) and High Card evaluation.
 * * RUNNING TESTS:
 * Execute 'npm test' in the /challenge-js directory to run this suite.
 */

var assert = require('assert');
var PokerHand = require('../pokerHand.js');

describe('PokerHand Ranking Tests', function() {
  
  it('should rank a Royal Flush', function() {
    var hand = new PokerHand('As Ks Qs Js 10s');
    assert.strictEqual(hand.getRank(), 'Royal Flush');
  });

  it('should rank a Straight Flush', function() {
    var hand = new PokerHand('9s 8s 7s 6s 5s');
    assert.strictEqual(hand.getRank(), 'Straight Flush');
  });

  it('should rank a Four of a Kind', function() {
    var hand = new PokerHand('9s 9h 9d 9c 5s');
    assert.strictEqual(hand.getRank(), 'Four of a Kind');
  });

  it('should rank a Full House', function() {
    var hand = new PokerHand('9s 9h 9d 5c 5s');
    assert.strictEqual(hand.getRank(), 'Full House');
  });

  it('should rank a Flush', function() {
    var hand = new PokerHand('Kh Qh 6h 2h 9h');
    assert.strictEqual(hand.getRank(), 'Flush');
  });

  it('should rank a Straight', function() {
    var hand = new PokerHand('9s 8h 7d 6c 5s');
    assert.strictEqual(hand.getRank(), 'Straight');
  });

  it('should rank a "Wheel" Straight (A 2 3 4 5)', function() {
    var hand = new PokerHand('As 2h 3d 4c 5s');
    assert.strictEqual(hand.getRank(), 'Straight');
  });

  it('should rank a Three of a Kind', function() {
    var hand = new PokerHand('9s 9h 9d 5c 2s');
    assert.strictEqual(hand.getRank(), 'Three of a Kind');
  });

  it('should rank a Two Pair', function() {
    var hand = new PokerHand('Kh Kc 3s 3h 2d');
    assert.strictEqual(hand.getRank(), 'Two Pair');
  });

  it('should rank a One Pair', function() {
    var hand = new PokerHand('Ah As 10c 7d 6s');
    assert.strictEqual(hand.getRank(), 'One Pair');
  });

  it('should rank a High Card', function() {
    var hand = new PokerHand('As Qd 9s 5h 2c');
    assert.strictEqual(hand.getRank(), 'High Card');
  });

});