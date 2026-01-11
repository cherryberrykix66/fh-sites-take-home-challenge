/**
 * Poker Hand Analyzer - Unit Tests
 * Version: 1.1.0
 * Author: Jenna James
 * Date Modified: January 11, 2026
 * * OVERVIEW:
 * This test suite validates the educational output and strategic logic of the 
 * HandAnalyzer module. It ensures that the "Trainer" advice correctly maps 
 * to identified hand ranks and that the UI-required data structures are 
 * correctly formed.
 * * TEST COVERAGE:
 * 1. Advice Accuracy: Verifies specific keyword assertions (e.g., "unbeatable", 
 * "caution", "bluff") based on the strength of the hand provided.
 * 2. Data Integrity: Checks that the analyzer correctly persists the cards 
 * being analyzed so they can be highlighted in the browser UI.
 * 3. Regression Testing: Specifically validates the fix for the "cardsUsed" 
 * property, ensuring it returns an array with a valid .length property to 
 * prevent TypeError crashes in the build.
 * 4. Boundary Testing: Confirms behavior for extreme ranks (Royal Flush vs. 
 * High Card) to ensure the full spectrum of advice is active.
 */

var assert = require('assert');
var HandAnalyzer = require('../src/handAnalyzer.js');

describe('HandAnalyzer Educational Tests', function() {
  
  it('should provide "unbeatable" advice for a Royal Flush', function() {
    var trainer = new HandAnalyzer('As Ks Qs Js 10s');
    assert.strictEqual(trainer.analysis.rank, 'Royal Flush');
    assert.ok(trainer.analysis.advice.includes('unbeatable monster hand'));
  });

  it('should provide "caution" advice for a Straight', () => {
    const straightHand = "5s 6h 7d 8c 9s"; // A valid 5-card straight
    const trainer = new HandAnalyzer(straightHand);
    // This assertion will pass if the advice contains "be cautious"
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