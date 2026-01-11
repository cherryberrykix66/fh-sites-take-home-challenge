/**
 * Poker Hand Analyzer - Unit Tests
 * Version: 1.0.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * Validates that the educational advice and strategic descriptions 
 * correctly match the identified poker ranks.
 */

var assert = require('assert');
var HandAnalyzer = require('../src/handAnalyzer.js');

describe('HandAnalyzer Educational Tests', function() {
  
  it('should provide "unbeatable" advice for a Royal Flush', function() {
    var trainer = new HandAnalyzer('As Ks Qs Js 10s');
    assert.strictEqual(trainer.analysis.rank, 'Royal Flush');
    assert.ok(trainer.analysis.advice.includes('unbeatable monster hand'));
  });

  it('should provide "caution" advice for a Straight', function() {
    var trainer = new HandAnalyzer('9s 8h 7d 6c 5s');
    assert.strictEqual(trainer.analysis.rank, 'Straight');
    assert.ok(trainer.analysis.advice.includes('be cautious'));
  });

  it('should advise folding or bluffing for a High Card', function() {
    var trainer = new HandAnalyzer('As Qd 9s 5h 2c');
    assert.strictEqual(trainer.analysis.rank, 'High Card');
    assert.ok(trainer.analysis.advice.includes('generally need a bluff or a fold'));
  });

  it('should correctly identify the cards being analyzed', function() {
    var trainer = new HandAnalyzer('Ah As 10c 7d 6s');
    assert.strictEqual(trainer.analysis.cardsUsed.length, 5);
    assert.strictEqual(trainer.analysis.rank, 'One Pair');
  });

});