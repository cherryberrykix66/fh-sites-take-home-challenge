# Poker Tool Suite: Modern Nightlife Edition
**Version:** 1.1.1  
**Author:** Jenna James  
**Date Modified:** January 11, 2026

## Overview
The **Poker Tool Suite** is a full-stack JavaScript application designed for competitive play simulation and poker education. It features a high-performance Texas Hold'em engine, a Monte Carlo-based statistical simulator, and an educational "Trainer" that provides real-time strategic advice.

The application is wrapped in a "Modern Nightlife" UI, utilizing neon aesthetics and glassmorphism to create an immersive digital casino experience.

---

## Key Features

### 1. Texas Hold'em Game Engine
The core of the application is a robust coordinator that implements the **"Best 5 of 7"** rule.
* **Recursive Combination Logic:** Identifies all 21 possible 5-card combinations from a player's 7-card pool (2 hole cards + 5 community cards).
* **Numeric Strength Scoring:** Converts complex hand ranks into integers (0–9) for rapid comparison.
* **Tie-Breaking:** Implements deep kicker analysis to resolve split pots and identical hand ranks using a specialized `valueOrder` frequency array.


### 2. Educational Hand Analyzer (The Trainer)
Designed as a bridge between technical data and gameplay theory.
* **Strategic Mapping:** Translates raw numeric strength into human-readable advice (e.g., value betting, bluffing, or cautious checking).
* **UI Highlighting:** Identifies the specific cards used to form a winning hand for visual reinforcement.


### 3. Statistical Simulator
A data-driven tool for mathematical probability analysis.
* **Monte Carlo Method:** Runs up to 10,000+ random trials to calculate the likelihood of hitting specific ranks.
* **Iterative UI Processing:** Utilizes `requestAnimationFrame` to run heavy computations in chunks, preventing the browser main thread from locking during simulation.

---

## Edge Case Reliability
The suite is rigorously tested against complex poker scenarios to ensure mathematical and logical accuracy. Key edge cases handled include:

* **The "Wheel" Straight:** Correctly identifies `A-2-3-4-5` as a valid Straight, automatically adjusting the Ace's value for tie-breaking.
* **3-Character Parsing:** Robustly handles the "10" card (e.g., `10s`), ensuring it is not truncated or misread during rank evaluation.
* **Kicker Depth:** When two players have identical primary ranks (like the same Pair), the engine performs a deep-dive comparison of remaining cards to determine a winner.
* **Duplicate Ranks:** Correctly prioritizes higher ranks over lower ones, such as identifying a Full House instead of just Three of a Kind when 7 cards are present.
* **Split Pots:** Identifies "Draw" scenarios where multiple players share the exact same hand strength, accurately returning all winners.

---

## 🛠 Technical Stack
* **Frontend:** HTML5, CSS3 (Custom Design Tokens & Flexbox).
* **Logic:** Modular JavaScript (ES6).
* **Build Tool:** Browserify (Bundles Node.js-style modules for browser availability).
* **Testing:** Mocha Framework with Node.js `assert`.

---

## Installation & Setup
### *Prerequisites*
* **Node.js:** Ensure you have the latest LTS version installed, which is required for NPM and build tools.
* **NPM:** Standard with Node.js; used for managing the suite's dependencies.

### *1. Initial Environment Setup*

First, clone the repository and install the necessary local dependencies. This will fetch **Browserify** for bundling, **Mocha** for testing, and **Watchify** for development.
```bash
npm install
```


### *2. Build for Production*
Because the source code uses modular `require()` syntax, you must bundle the files into a single distribution script for browser compatibility.
```bash
npm run build
```
This executes `browserify src/main.js -o bundle.js`, creating the necessary bridge between your logic and the HTML interface.

### *3. Verification through Testing*
Before launching, verify that the ranking engine and hand analyzer are performing accurately by running the automated test suite.
```bash
npm test
```
This triggers **Mocha**, which scans the `tests/` directory to validate all 10 poker ranks, 7-card combination logic, and educational advice strings.

### *4. Development & Real-time Updates*
If you are modifying the code, use the watch script to automatically re-bundle the project every time you save a file.
```bash
npm run watch
```

### *5. Launch the Application*
Once the `bundle.js` has been generated, simply open `index.html` in any modern web browser to access the dashboard.

---

## Project Structure

The project is organized into a clean separation of concerns, isolating core game logic from UI orchestration and quality assurance tests.

```text
.
├── public/                     # Static Web Assets
│   ├── index.html              # Main Dashboard Interface
│   └── styles.css              # Modern Nightlife Theme & Glassmorphism
├── src/                        # Modular Core Logic
│   ├── handAnalyzer.js         # Strategy & Advice Engine
│   ├── main.js                 # UI Entry Point & Orchestrator
│   ├── pokerHand.js            # Ranking & Kicker Logic
│   ├── statisticalSimulator.js # Monte Carlo Probability Engine
│   └── texasHoldemEngine.js    # 7-card Coordinator
├── test/                       # Automated Test Suites
│   ├── edgeCasesTest.js        # Validates Wheels, 10s, and Draws
│   ├── handAnalyzerTest.js     # Validates advice strings
│   ├── pokerHandTest.js        # Validates all 10 poker ranks
│   ├── statisticalSimulatorTest.js # Verifies shuffle entropy
│   └── texasHoldemEngineTest.js    # Tests Best-5-of-7 logic
├── bundle.js                   # Compiled distribution file (generated)
├── package.json                # Dependencies & Build Scripts
└── README.md                   # Project Documentation
```