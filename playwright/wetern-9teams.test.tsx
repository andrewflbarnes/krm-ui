import { test, expect } from '@playwright/test';

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

test('test', async ({ page }) => {
  await page.goto('http://localhost:5174/krm-ui');
  await page.getByRole('link', { name: 'Teams' }).click();
  await page.getByRole('main').getByRole('button').click();
  await page.getByText('Load config', { exact: true }).click();
  await page.getByText('Yes').click();
  
  await expect(page.getByText('Config loaded for ')).toBeVisible();
  await page.getByRole('link', { name: 'Race' }).click();
  await page.getByRole('link', { name: 'New' }).click();
  await page.getByRole('button', { name: 'Next' }).click();
  const addClub = page.getByTestId('add-team').locator('input')
  await addClub.click();
  await addClub.fill('Test');
  await page.getByTestId('add-team').getByRole('button').click();
  const clubRow = page.getByRole('row', { name: 'Test' })
  const mixedTeams = clubRow.locator('input').nth(0)
  await mixedTeams.click();
  await mixedTeams.fill('9');
  const ladiesTeams = clubRow.locator('input').nth(1)
  await ladiesTeams.click();
  await ladiesTeams.fill('8');
  const boardTeams = clubRow.locator('input').nth(2)
  await boardTeams.click();
  await boardTeams.fill('8');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.locator('h3')).toContainText('Missing teams');
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByRole('heading', { name: 'Mixed' })).toBeAttached()
  await page.getByRole('button', { name: 'Next' }).click({
    position: { x: 10, y: 10 },
  });
  await page.getByRole('button', { name: 'Done' }).click();
  await expect(page.getByLabel('Stage 1')).toContainText('Stage 1');
  await page.getByRole('button', { name: 'View Race List' }).click();
  await page.getByText('Mini Leagues').click();
  const mixedA = page.getByRole('table').filter({ hasText: 'Mixed A' })
  await expect(mixedA).toBeAttached();
  await mixedA.getByTestId('race-A-0-1').click();
  await mixedA.getByTestId('race-A-1-1').click();
  await mixedA.getByTestId('race-A-2-1').click();
  const mixedB = page.getByRole('table').filter({ hasText: 'Mixed B' })
  await mixedB.getByTestId('race-B-0-1').click();
  await mixedB.getByTestId('race-B-1-1').click();
  await mixedB.getByTestId('race-B-2-1').click();
  const mixedC = page.getByRole('table').filter({ hasText: 'Mixed C' })
  await mixedC.getByTestId('race-C-0-1').click();
  await mixedC.getByTestId('race-C-1-1').click();
  await mixedC.getByTestId('race-C-2-1').click();

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

  const boardA = page.getByRole('table').filter({ hasText: 'Board A' })
  await boardA.getByTestId('race-A-0-1').click();
  await boardA.getByTestId('race-A-1-1').click();
  await boardA.getByTestId('race-A-2-1').click();
  await boardA.getByTestId('race-A-3-1').click();
  await boardA.getByTestId('race-A-4-1').click();
  await boardA.getByTestId('race-A-5-1').click();
  const boardB = page.getByRole('table').filter({ hasText: 'Board B' })
  await boardB.getByTestId('race-B-0-1').click();
  await boardB.getByTestId('race-B-1-1').click();
  await boardB.getByTestId('race-B-2-1').click();
  await boardB.getByTestId('race-B-3-1').click();
  await boardB.getByTestId('race-B-4-1').click();
  await boardB.getByTestId('race-B-5-1').click();

  await expect(page.getByRole('main')).toContainText('Start Stage 2');
  await page.getByRole('button', { name: 'Start Stage' }).click();
  await page.getByText('Yes').click();

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

  const ladiesI = page.getByRole('table').filter({ hasText: 'Ladies I' })
  await ladiesI.getByTestId('race-I-0-1').click();
  await ladiesI.getByTestId('race-I-1-2').click();
  await ladiesI.getByTestId('race-I-2-1').click();
  await ladiesI.getByTestId('race-I-3-1').click();
  await ladiesI.getByTestId('race-I-4-1').click();
  await ladiesI.getByTestId('race-I-5-1').click();
  const ladiesII = page.getByRole('table').filter({ hasText: 'Ladies II' })
  await ladiesII.getByTestId('race-II-0-1').click();
  await ladiesII.getByTestId('race-II-1-2').click();
  await ladiesII.getByTestId('race-II-2-1').click();
  await ladiesII.getByTestId('race-II-3-1').click();
  await ladiesII.getByTestId('race-II-4-1').click();
  await ladiesII.getByTestId('race-II-5-1').click();

  const boardI = page.getByRole('table').filter({ hasText: 'Board I' })
  await boardI.getByTestId('race-I-0-1').click();
  await boardI.getByTestId('race-I-1-2').click();
  await boardI.getByTestId('race-I-2-1').click();
  await boardI.getByTestId('race-I-3-1').click();
  await boardI.getByTestId('race-I-4-1').click();
  await boardI.getByTestId('race-I-5-1').click();
  const boardII = page.getByRole('table').filter({ hasText: 'Board II' })
  await boardII.getByTestId('race-II-0-1').click();
  await boardII.getByTestId('race-II-1-2').click();
  await boardII.getByTestId('race-II-2-1').click();
  await boardII.getByTestId('race-II-3-1').click();
  await boardII.getByTestId('race-II-4-1').click();
  await boardII.getByTestId('race-II-5-1').click();

  await expect(page.getByRole('main')).toContainText('Start Knockouts');
  await page.getByRole('button', { name: 'Start Knockouts' }).click();
  await page.getByText('Yes').click();

  await page.getByRole('table').filter({ hasText: 'Mixed 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Mixed 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Mixed 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  await page.getByRole('table').filter({ hasText: 'Ladies 7th/8th' }).getByTestId('race-7th/8th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Ladies 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  await page.getByRole('table').filter({ hasText: 'Board 7th/8th' }).getByTestId('race-7th/8th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 5th/6th' }).getByTestId('race-5th/6th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 3rd/4th' }).getByTestId('race-3rd/4th-0-1').click();
  await page.getByRole('table').filter({ hasText: 'Board 1st/2nd' }).getByTestId('race-1st/2nd-0-1').click();

  await expect(page.getByRole('main')).toContainText('Finish');
  await page.getByRole('button', { name: 'Finish' }).click();
  await page.getByText('Yes').click();
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
  const ladiesResults = page.getByTestId('results-ladies')
  await expect(ladiesResults.getByRole('row', { name: '1st' })).toContainText('Test 1')
  await expect(ladiesResults.getByRole('row', { name: '2nd' })).toContainText('Test 2')
  await expect(ladiesResults.getByRole('row', { name: '3rd' })).toContainText('Test 3')
  await expect(ladiesResults.getByRole('row', { name: '4th' })).toContainText('Test 4')
  await expect(ladiesResults.getByRole('row', { name: '5th' })).toContainText('Test 5')
  await expect(ladiesResults.getByRole('row', { name: '6th' })).toContainText('Test 6')
  await expect(ladiesResults.getByRole('row', { name: '7th' })).toContainText('Test 7')
  await expect(ladiesResults.getByRole('row', { name: '8th' })).toContainText('Test 8')
  const boardResults = page.getByTestId('results-board')
  await expect(boardResults.getByRole('row', { name: '1st' })).toContainText('Test 1')
  await expect(boardResults.getByRole('row', { name: '2nd' })).toContainText('Test 2')
  await expect(boardResults.getByRole('row', { name: '3rd' })).toContainText('Test 3')
  await expect(boardResults.getByRole('row', { name: '4th' })).toContainText('Test 4')
  await expect(boardResults.getByRole('row', { name: '5th' })).toContainText('Test 5')
  await expect(boardResults.getByRole('row', { name: '6th' })).toContainText('Test 6')
  await expect(boardResults.getByRole('row', { name: '7th' })).toContainText('Test 7')
  await expect(boardResults.getByRole('row', { name: '8th' })).toContainText('Test 8')
});
