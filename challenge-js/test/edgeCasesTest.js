const assert = require('assert');
const PokerHand = require('../pokerHand.js');
const TexasHoldemEngine = require('../texasHoldemEngine.js');

describe('Poker Tool Suite - Edge Case Verification', function() {

    // 1. The "10" vs. Face Cards
    it('should correctly parse the 3-character "10" card and identify Four of a Kind', function() {
        const hand = new PokerHand("10s 10h 10c 10d As");
        assert.strictEqual(hand.getRank(), 'Four of a Kind');
    });

    // 2. Non-Sequential Straights (Duplicates)
    it('should identify One Pair instead of a Straight when duplicates exist (8-7-6-6-5)', function() {
        const hand = new PokerHand("8s 7h 6d 6c 5s");
        assert.strictEqual(hand.getRank(), 'One Pair');
        assert.notStrictEqual(hand.getRank(), 'Straight');
    });

    // 3. King-High Straight vs. Royal Flush
    it('should identify a King-high Straight Flush as "Straight Flush", not "Royal Flush"', function() {
        const hand = new PokerHand("Ks Qs Js 10s 9s");
        assert.strictEqual(hand.getRank(), 'Straight Flush');
        // Ensure it doesn't accidentally trigger Royal Flush logic
        const royal = new PokerHand("As Ks Qs Js 10s");
        assert.strictEqual(royal.getRank(), 'Royal Flush');
    });

    // 4. Multiple Pairs in a Hand (7-Card Evaluator)
    it('should select the two highest pairs from a 7-card pool (AA, KK, QQ)', function() {
        const community = ["Kh", "Kc", "Qs", "Qd", "2d"];
        const players = [
            { name: "Alice", holeCards: ["As", "Ah"] }
        ];
        const engine = new TexasHoldemEngine(community, players);
        const results = engine.determineWinner();
        
        // Alice's best 5-card hand should be A-A-K-K-Q (Two Pair, Aces and Kings)
        assert.strictEqual(results[0].finalRankName, 'Two Pair');
        // If your engine stores the specific pairs, you'd verify they are Aces and Kings
    });

    // 5. Unordered Input Strings & The Wheel
    it('should identify a "Wheel" Straight (A-2-3-4-5) from unsorted input', function() {
        const hand = new PokerHand("2h 5s 3d As 4c");
        assert.strictEqual(hand.getRank(), 'Straight');
    });

    // 6. Split Pot (Draw) logic
    it('should declare a "Split Pot!" when two players have identical 5-card hands', function() {
        const community = ["As", "Ks", "Qs", "Js", "10s"]; // Royal Flush on the board
        const players = [
            { name: "Alice", holeCards: ["2h", "3h"] },
            { name: "Bob", holeCards: ["2c", "3c"] }
        ];
        // In the UI, playRound() handles the "Split Pot!" text
        // Here we test the engine's winner array length
        const engine = new TexasHoldemEngine(community, players);
        const winners = engine.determineWinner();
        
        assert.strictEqual(winners.length, 2, "Both players should be winners in a split pot");
    });
});