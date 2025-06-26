import { test as base, expect } from '@playwright/test';
import { ResultsHelper } from './fixtures/results-helper';
import { RoundSetup } from './fixtures/round-setup';

//test('has title', async ({ page }) => {
//  await page.goto('https://playwright.dev/');
//
//  // Expect a title "to contain" a substring.
//  await expect(page).toHaveTitle(/Playwright/);
//});
//
//test('get started link', async ({ page }) => {
//  await page.goto('https://playwright.dev/');
//
//  // Click the get started link.
//  await page.getByRole('link', { name: 'Get started' }).click();
//
//  // Expects page to have a heading with the name of Installation.
//  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
//});
//import { test, expect } from '@playwright/test';

const test = base.extend<{
  roundSetup: RoundSetup;
  resultsHelper: ResultsHelper;
}>({
  roundSetup: async ({ page }, use) => {
    const roundSetup = new RoundSetup(page);
    await use(roundSetup);
  },
  resultsHelper: async ({ page }, use) => {
    const resultsHelper = new ResultsHelper(page);
    await use(resultsHelper);
  },
})

test('9 mixed, 8 ladies and 7 board teams with expected results', async ({ page, roundSetup, resultsHelper }) => {
  await page.goto('http://localhost:5174/krm-ui');

  const club = 'Test';
  await roundSetup.resetData();
  await roundSetup.setupRound({
    [club]: { mixed: 9, ladies: 8, board: 7 }
  });

  // Stage 1
  await resultsHelper.startStage1();
  await resultsHelper.viewMiniLeagues();

  // Mixed stage 1
  await resultsHelper.setWinners("Mixed", "A", [1, 1, 1]);
  await resultsHelper.setWinners("Mixed", "B", [1, 1, 1]);
  await resultsHelper.setWinners("Mixed", "C", [1, 1, 1]);

  // Ladies stage 1
  await resultsHelper.setWinners("Ladies", "A", [1, 1, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Ladies", "B", [1, 1, 1, 1, 1, 1]);

  // Board stage 1
  await resultsHelper.setWinners("Board", "A", [1, 1, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Board", "B", [1, 1, 1]);

  // Stage 2
  await resultsHelper.startStage2();

  // Mixed stage 2
  await resultsHelper.setWinners("Mixed", "I", [1, 2, 1]);
  await resultsHelper.setWinners("Mixed", "II", [2, 1, 2]);
  await resultsHelper.setWinners("Mixed", "III", [1, 1, 1]);

  // Ladies stage 2
  await resultsHelper.setWinners("Ladies", "I", [1, 2, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Ladies", "II", [1, 2, 1, 1, 1, 1]);

  // Board stage 2
  await resultsHelper.setWinners("Board", "I", [1, 2, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Board", "II", [1, 1, 1]);

  // Knockouts
  await resultsHelper.startKnockouts();

  // Mixed Knockouts
  await resultsHelper.setKnockoutWinners("Mixed", [
    { position: 5, teamNumber: 1 },
    { position: 3, teamNumber: 1 },
    { position: 1, teamNumber: 1 }
  ])

  // Ladies Knockouts
  await resultsHelper.setKnockoutWinners("Ladies", [
    { position: 7, teamNumber: 1 },
    { position: 5, teamNumber: 1 },
    { position: 3, teamNumber: 1 },
    { position: 1, teamNumber: 1 }
  ])

  // Board Knockouts - none

  // Results
  await resultsHelper.finishRaces();

  // Mixed results
  await resultsHelper.verifyResults('Mixed', club, 9);

  // Ladies results
  await resultsHelper.verifyResults('Ladies', club, 8);

  // Board results
  await resultsHelper.verifyResults('Board', club, 7);
});

test('10 mixed, 11 ladies and 12 board teams with expected results', async ({ page, roundSetup, resultsHelper }) => {
  await page.goto('http://localhost:5174/krm-ui');

  const club = 'Test';
  await roundSetup.resetData();
  await roundSetup.setupRound({
    [club]: { mixed: 10, ladies: 11, board: 12 }
  });

  // Stage 1
  await resultsHelper.startStage1();
  await resultsHelper.viewMiniLeagues();

  // Mixed stage 1 - 10 teams: A(4), B(3), C(3)
  await resultsHelper.setWinners("Mixed", "A", [1, 1, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Mixed", "B", [1, 1, 1]);
  await resultsHelper.setWinners("Mixed", "C", [1, 1, 1]);

  // Ladies stage 1 - 11 teams: A(4), B(4), C(3)
  await resultsHelper.setWinners("Ladies", "A", [1, 1, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Ladies", "B", [1, 1, 1, 1, 1, 1]);
  await resultsHelper.setWinners("Ladies", "C", [1, 1, 1]);

  // Board stage 1 - 12 teams: A(3), B(3), C(3), D(3)
  await resultsHelper.setWinners("Board", "A", [1, 1, 1]);
  await resultsHelper.setWinners("Board", "B", [1, 1, 1]);
  await resultsHelper.setWinners("Board", "C", [1, 1, 1]);
  await resultsHelper.setWinners("Board", "D", [1, 1, 1]);

  // Stage 2
  await resultsHelper.startStage2();

  // Mixed stage 2 - 10 teams: I(3), II(3), III(4)
  await resultsHelper.setWinners("Mixed", "I", [1, 2, 1]);
  await resultsHelper.setWinners("Mixed", "II", [2, 1, 2]);
  await resultsHelper.setWinners("Mixed", "III", [1, 1, 1, 1, 1, 1]);

  // Ladies stage 2 - 11 teams: I(4), II(4), III(3)
  await resultsHelper.setWinners("Ladies", "I", [1, 1, 2, 1, 1, 1]);
  await resultsHelper.setWinners("Ladies", "II", [2, 1, 1, 1, 2, 1]);
  await resultsHelper.setWinners("Ladies", "III", [2, 2, 2]);

  // Board stage 2 - 12 teams: I(4), II(4), III(4)
  await resultsHelper.setWinners("Board", "I", [1, 1, 2, 1, 1, 2]);
  await resultsHelper.setWinners("Board", "II", [2, 2, 1, 2, 2, 1]);
  await resultsHelper.setWinners("Board", "III", [1, 1, 1, 1, 1, 1]);

  // Knockouts
  await resultsHelper.startKnockouts();

  // Mixed Knockouts - 10 teams (6 knockout races for places 1-6, rest from stage2 III)
  await resultsHelper.setKnockoutWinners("Mixed", [
    { position: 5, teamNumber: 1 },
    { position: 3, teamNumber: 1 },
    { position: 1, teamNumber: 1 }
  ])

  // Ladies Knockouts - 11 teams (8 knockout races for places 1-8, rest from stage2 III)  
  await resultsHelper.setKnockoutWinners("Ladies", [
    { position: 7, teamNumber: 1 },
    { position: 5, teamNumber: 1 },
    { position: 3, teamNumber: 1 },
    { position: 1, teamNumber: 1 }
  ])

  // Board Knockouts - 12 teams (8 knockout races for places 1-8, rest from stage2 III)
  await resultsHelper.setKnockoutWinners("Board", [
    { position: 7, teamNumber: 1 },
    { position: 5, teamNumber: 1 },
    { position: 3, teamNumber: 1 },
    { position: 1, teamNumber: 1 }
  ])

  // Results
  await resultsHelper.finishRaces();

  // Mixed results - 10 teams
  await resultsHelper.verifyResults('Mixed', club, 10);

  // Ladies results - 11 teams
  await resultsHelper.verifyResults('Ladies', club, 11);

  // Board results - 12 teams
  await resultsHelper.verifyResults('Board', club, 12);
});
