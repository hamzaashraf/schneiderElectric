# Schneider Electric Assignment
Automated Playwright tests for TensorFlow Playground (https://playground.tensorflow.org), built with TypeScript and the Page Object Model (POM) pattern.

## Prerequisites

- [Node.js] (https://nodejs.org/) (LTS version)
- npm (comes with Node.js)

If this is your first time setting up Playwright, or you run into environment issues, refer to the official install guide: https://playwright.dev/docs/intro

## Environment Setup
1. Clone or pull this repository.
2. Install dependencies:

    npm install

3. Install the Playwright browser binaries:

   npx playwright install

No local dev server or `.env` file is required — the tests drive the public TensorFlow Playground site directly.

## Running the Tests
- Run the assignment's test case (headed, so the simulation is visible while it runs):
    npx playwright test tests/tensorTest.spec.ts --headed

- Run it headless instead:

    npx playwright test tests/tensorTest.spec.ts

    These commands will work smoothly when you are in the project folder in your terminal otherwise state the folder path in the commands.

## Use of AI

In the interest of transparency, here's where AI assisted in this submission:

- Reusable feature toggles (`featureToggle`, `featureNode`, `toggleFeature`, `getFeatureState` in `tensor.page.ts`): I used AI to help design this part. My intuition was that with the same dataset, a tester is likely to need to increase or decrease the input features (e.g. `xSquared`, `ySquared`) depending on what they're validating, so I wanted the toggle logic to be generic and reusable rather than hardcoded per feature. I used AI to help turn that intuition into a clean, typed, reusable implementation.
- `expect.poll()` for feature state checks: AI introduced this pattern where a test needs to wait on a value that updates asynchronously (e.g. feature active state can be undone if clicked twice) rather than checking it once. I hadn't used `poll()` before — writing it this way helped me learn the pattern, and I've adopted it here because it retries instead of racing the UI.
- `getEpoch()` polling loop: for this one, I intentionally kept the manual `while` loop I originally wrote myself, rather than switching to the AI-suggested `poll()` equivalent, so this submission reflects my own first-pass approach to the polling problem. I plan to refactor this to `poll()` in future work, now that I understand the pattern.
- Regex used in this project are extracted from open source websites, i did not created it my self.

All locators, test flow, and the rest of the implementation were written and verified by me against the live app.