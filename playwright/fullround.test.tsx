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

test('10 mixed, 11 ladies and 12 board teams with expected results', async ({ page, roundSetup }) => {
  await page.goto('http://localhost:5174/krm-ui');

  const club = 'Test';
  await roundSetup.resetData();
  await roundSetup.setupRound({
    [club]: { mixed: 10, ladies: 11, board: 12 }
  });

  // Stage 1
  await expect(page.getByLabel('Stage 1')).toContainText('Stage 1');
  await page.getByRole('button', { name: 'View Race List' }).click();
  await page.getByText('Mini Leagues').click();

  // Mixed stage 1 - 10 teams: A(4), B(3), C(3)
  const mixedA = page.getByRole('table').filter({ hasText: 'Mixed A' })
  await expect(mixedA).toBeAttached();
  await mixedA.getByTestId('race-A-0-1').click();
  await mixedA.getByTestId('race-A-1-1').click();
  await mixedA.getByTestId('race-A-2-1').click();
  await mixedA.getByTestId('race-A-3-1').click();
  await mixedA.getByTestId('race-A-4-1').click();
  await mixedA.getByTestId('race-A-5-1').click();
  const mixedB = page.getByRole('table').filter({ hasText: 'Mixed B' })
  await mixedB.getByTestId('race-B-0-1').click();
  await mixedB.getByTestId('race-B-1-1').click();
  await mixedB.getByTestId('race-B-2-1').click();
  const mixedC = page.getByRole('table').filter({ hasText: 'Mixed C' })
  await mixedC.getByTestId('race-C-0-1').click();
  await mixedC.getByTestId('race-C-1-1').click();
  await mixedC.getByTestId('race-C-2-1').click();

  // Ladies stage 1 - 11 teams: A(4), B(4), C(3)
  const ladiesA = page.getByRole('table').filter({ hasText: 'Ladies A' })
  await ladiesA.getByTestId('race-A-0-1').click();
  await ladiesA.getByTestId('race-A-1-1').click();
  await ladiesA.getByTestId('race-A-2-1').click();
  await ladiesA.getByTestId('race-A-3-1').click();
  await ladiesA.getByTestId('race-A-4-1').click();
  await ladiesA.getByTestId('race-A-5-1').click();
  const ladiesB = page.getByRole('table').filter({ hasText: 'Ladies B' })
  await ladiesB.getByTestId('race-B-0-1').click();
  await ladiesB.getByTestId('race-B-1-1').click();
  await ladiesB.getByTestId('race-B-2-1').click();
  await ladiesB.getByTestId('race-B-3-1').click();
  await ladiesB.getByTestId('race-B-4-1').click();
  await ladiesB.getByTestId('race-B-5-1').click();
  const ladiesC = page.getByRole('table').filter({ hasText: 'Ladies C' })
  await ladiesC.getByTestId('race-C-0-1').click();
  await ladiesC.getByTestId('race-C-1-1').click();
  await ladiesC.getByTestId('race-C-2-1').click();

  // Board stage 1 - 12 teams: A(3), B(3), C(3), D(3)
  const boardA = page.getByRole('table').filter({ hasText: 'Board A' })
  await boardA.getByTestId('race-A-0-1').click();
  await boardA.getByTestId('race-A-1-1').click();
  await boardA.getByTestId('race-A-2-1').click();
  const boardB = page.getByRole('table').filter({ hasText: 'Board B' })
  await boardB.getByTestId('race-B-0-1').click();
  await boardB.getByTestId('race-B-1-1').click();
  await boardB.getByTestId('race-B-2-1').click();
  const boardC = page.getByRole('table').filter({ hasText: 'Board C' })
  await boardC.getByTestId('race-C-0-1').click();
  await boardC.getByTestId('race-C-1-1').click();
  await boardC.getByTestId('race-C-2-1').click();
  const boardD = page.getByRole('table').filter({ hasText: 'Board D' })
  await boardD.getByTestId('race-D-0-1').click();
  await boardD.getByTestId('race-D-1-1').click();
  await boardD.getByTestId('race-D-2-1').click();

  // Stage 2
  await expect(page.getByRole('main')).toContainText('Start Stage 2');
  await page.getByRole('button', { name: 'Start Stage' }).click();
  await page.getByText('Yes').click();

  // Mixed stage 2 - 10 teams: I(3), II(3), III(4)
  const mixedI = page.getByRole('table').filter({ hasText: 'Mixed I' })
  await mixedI.getByTestId('race-I-0-1').click();
  await mixedI.getByTestId('race-I-1-2').click();
  await mixedI.getByTestId('race-I-2-1').click();
  const mixedII = page.getByRole('table').filter({ hasText: 'Mixed II' })
  await mixedII.getByTestId('race-II-0-2').click();
  await mixedII.getByTestId('race-II-1-1').click();
  await mixedII.getByTestId('race-II-2-2').click();
  const mixedIII = page.getByRole('table').filter({ hasText: 'Mixed III' })
  await mixedIII.getByTestId('race-III-0-1').click();
  await mixedIII.getByTestId('race-III-1-1').click();
  await mixedIII.getByTestId('race-III-2-1').click();
  await mixedIII.getByTestId('race-III-3-1').click();
  await mixedIII.getByTestId('race-III-4-1').click();
  await mixedIII.getByTestId('race-III-5-1').click();

  // Ladies stage 2 - 11 teams: I(4), II(4), III(3)
  const ladiesI = page.getByRole('table').filter({ hasText: 'Ladies I' })
  await ladiesI.getByTestId('race-I-0-1').click();
  await ladiesI.getByTestId('race-I-1-1').click();
  await ladiesI.getByTestId('race-I-2-2').click();
  await ladiesI.getByTestId('race-I-3-1').click();
  await ladiesI.getByTestId('race-I-4-1').click();
  await ladiesI.getByTestId('race-I-5-1').click();
  const ladiesII = page.getByRole('table').filter({ hasText: 'Ladies II' })
  await ladiesII.getByTestId('race-II-0-2').click();
  await ladiesII.getByTestId('race-II-1-1').click();
  await ladiesII.getByTestId('race-II-2-1').click();
  await ladiesII.getByTestId('race-II-3-1').click();
  await ladiesII.getByTestId('race-II-4-2').click();
  await ladiesII.getByTestId('race-II-5-1').click();
  const ladiesIII = page.getByRole('table').filter({ hasText: 'Ladies III' })
  await ladiesIII.getByTestId('race-III-0-2').click();
  await ladiesIII.getByTestId('race-III-1-2').click();
  await ladiesIII.getByTestId('race-III-2-2').click();

  // Board stage 2 - 12 teams: I(4), II(4), III(4)
  const boardI = page.getByRole('table').filter({ hasText: 'Board I' })
  await boardI.getByTestId('race-I-0-1').click();
  await boardI.getByTestId('race-I-1-1').click();
  await boardI.getByTestId('race-I-2-2').click();
  await boardI.getByTestId('race-I-3-1').click();
  await boardI.getByTestId('race-I-4-1').click();
  await boardI.getByTestId('race-I-5-2').click();
  const boardII = page.getByRole('table').filter({ hasText: 'Board II' })
  await boardII.getByTestId('race-II-0-2').click();
  await boardII.getByTestId('race-II-1-2').click();
  await boardII.getByTestId('race-II-2-1').click();
  await boardII.getByTestId('race-II-3-2').click();
  await boardII.getByTestId('race-II-4-2').click();
  await boardII.getByTestId('race-II-5-1').click();
  const boardIII = page.getByRole('table').filter({ hasText: 'Board III' })
  await boardIII.getByTestId('race-III-0-1').click();
  await boardIII.getByTestId('race-III-1-1').click();
  await boardIII.getByTestId('race-III-2-1').click();
  await boardIII.getByTestId('race-III-3-1').click();
  await boardIII.getByTestId('race-III-4-1').click();
  await boardIII.getByTestId('race-III-5-1').click();

  // Knockouts
  await expect(page.getByRole('main')).toContainText('Start Knockouts');
  await page.getByRole('button', { name: 'Start Knockouts' }).click();
  await page.getByText('Yes').click();

  // Mixed Knockouts - 10 teams (6 knockout races for places 1-6, rest from stage2 III)
  await page.getByRole('table').filter({ hasText: 'Mixed 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Mixed 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Mixed 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  // Ladies Knockouts - 11 teams (8 knockout races for places 1-8, rest from stage2 III)  
  await page.getByRole('table').filter({ hasText: 'Ladies 7th/8th' }).getByTestId('race-7th/8th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  // Board Knockouts - 12 teams (8 knockout races for places 1-8, rest from stage2 III)
  await page.getByRole('table').filter({ hasText: 'Board 7th/8th' }).getByTestId('race-7th/8th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  // Results
  await expect(page.getByRole('main')).toContainText('Finish');
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByText('Yes').click();

  // Mixed results - 10 teams
  const mixedResults = page.getByTestId('results-mixed')
  await expect(mixedResults.getByRole('row', { name: '1st' })).toContainText('Test 1')
  await expect(mixedResults.getByRole('row', { name: '2nd' })).toContainText('Test 2')
  await expect(mixedResults.getByRole('row', { name: '3rd' })).toContainText('Test 3')
  await expect(mixedResults.getByRole('row', { name: '4th' })).toContainText('Test 4')
  await expect(mixedResults.getByRole('row', { name: '5th' })).toContainText('Test 5')
  await expect(mixedResults.getByRole('row', { name: '6th' })).toContainText('Test 6')
  await expect(mixedResults.getByRole('row', { name: '7th' })).toContainText('Test 7')
  await expect(mixedResults.getByRole('row', { name: '8th' })).toContainText('Test 8')
  await expect(mixedResults.getByRole('row', { name: '9th' })).toContainText('Test 9')
  await expect(mixedResults.getByRole('row', { name: '10th' })).toContainText('Test 10')

  // Ladies results - 11 teams
  const ladiesResults = page.getByTestId('results-ladies')
  await expect(ladiesResults.getByRole('row', { name: '1st' })).toContainText('Test 1')
  await expect(ladiesResults.getByRole('row', { name: '2nd' })).toContainText('Test 2')
  await expect(ladiesResults.getByRole('row', { name: '3rd' })).toContainText('Test 3')
  await expect(ladiesResults.getByRole('row', { name: '4th' })).toContainText('Test 4')
  await expect(ladiesResults.getByRole('row', { name: '5th' })).toContainText('Test 5')
  await expect(ladiesResults.getByRole('row', { name: '6th' })).toContainText('Test 6')
  await expect(ladiesResults.getByRole('row', { name: '7th' })).toContainText('Test 7')
  await expect(ladiesResults.getByRole('row', { name: '8th' })).toContainText('Test 8')
  await expect(ladiesResults.getByRole('row', { name: '9th' })).toContainText('Test 9')
  await expect(ladiesResults.getByRole('row', { name: '10th' })).toContainText('Test 10')
  await expect(ladiesResults.getByRole('row', { name: '11th' })).toContainText('Test 11')

  // Board results - 12 teams
  const boardResults = page.getByTestId('results-board')
  await expect(boardResults.getByRole('row', { name: '1st' })).toContainText('Test 1')
  await expect(boardResults.getByRole('row', { name: '2nd' })).toContainText('Test 2')
  await expect(boardResults.getByRole('row', { name: '3rd' })).toContainText('Test 3')
  await expect(boardResults.getByRole('row', { name: '4th' })).toContainText('Test 4')
  await expect(boardResults.getByRole('row', { name: '5th' })).toContainText('Test 5')
  await expect(boardResults.getByRole('row', { name: '6th' })).toContainText('Test 6')
  await expect(boardResults.getByRole('row', { name: '7th' })).toContainText('Test 7')
  await expect(boardResults.getByRole('row', { name: '8th' })).toContainText('Test 8')
  await expect(boardResults.getByRole('row', { name: '9th' })).toContainText('Test 9')
  await expect(boardResults.getByRole('row', { name: '10th' })).toContainText('Test 10')
  await expect(boardResults.getByRole('row', { name: '11th' })).toContainText('Test 11')
  await expect(boardResults.getByRole('row', { name: '12th' })).toContainText('Test 12')
});
