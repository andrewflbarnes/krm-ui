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
  await page.locator('#mui-cl-2').click();
  await page.locator('#mui-cl-2').fill('2');
  await page.locator('#mui-cl-2').press('Tab');
  await page.locator('#mui-cl-3').fill('2');
  await page.locator('#mui-cl-3').press('Tab');
  await page.locator('#mui-cl-4').fill('2');
  await page.locator('#mui-cl-4').press('Tab');
  await page.locator('#mui-cl-5').fill('2');
  await page.locator('#mui-cl-5').press('Tab');
  await page.locator('#mui-cl-6').fill('2');
  await page.locator('#mui-cl-6').press('Tab');
  await page.locator('#mui-cl-7').fill('2');
  await page.locator('#mui-cl-7').press('Tab');
  await page.locator('#mui-cl-8').fill('2');
  await page.locator('#mui-cl-8').press('Tab');
  await page.locator('#mui-cl-9').fill('2');
  await page.locator('#mui-cl-9').press('Tab');
  await page.locator('#mui-cl-10').fill('2');
  await page.locator('#mui-cl-10').press('Tab');
  await page.locator('#mui-cl-11').fill('2');
  await page.locator('#mui-cl-11').press('Tab');
  await page.locator('#mui-cl-12').fill('2');
  await page.locator('#mui-cl-12').press('Tab');
  await page.locator('#mui-cl-13').fill('2');
  await page.locator('#mui-cl-13').press('Tab');
  await page.locator('#mui-cl-14').fill('1');
  await page.locator('#mui-cl-14').press('Tab');
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
  await mixedI.getByTestId('race-I-1-1').click();
  await mixedI.getByTestId('race-I-2-1').click();
  const mixedII = page.getByRole('table').filter({ hasText: 'Mixed II' })
  await mixedII.getByTestId('race-II-0-1').click();
  await mixedII.getByTestId('race-II-1-1').click();
  await mixedII.getByTestId('race-II-2-1').click();
  const mixedIII = page.getByRole('table').filter({ hasText: 'Mixed III' })
  await mixedIII.getByTestId('race-III-0-1').click();
  await mixedIII.getByTestId('race-III-1-1').click();
  await mixedIII.getByTestId('race-III-2-1').click();

  const ladiesI = page.getByRole('table').filter({ hasText: 'Ladies I' })
  await ladiesI.getByTestId('race-I-0-1').click();
  await ladiesI.getByTestId('race-I-1-1').click();
  await ladiesI.getByTestId('race-I-2-1').click();
  await ladiesI.getByTestId('race-I-3-1').click();
  await ladiesI.getByTestId('race-I-4-1').click();
  await ladiesI.getByTestId('race-I-5-1').click();
  const ladiesII = page.getByRole('table').filter({ hasText: 'Ladies II' })
  await ladiesII.getByTestId('race-II-0-1').click();
  await ladiesII.getByTestId('race-II-1-1').click();
  await ladiesII.getByTestId('race-II-2-1').click();
  await ladiesII.getByTestId('race-II-3-1').click();
  await ladiesII.getByTestId('race-II-4-1').click();
  await ladiesII.getByTestId('race-II-5-1').click();

  const boardI = page.getByRole('table').filter({ hasText: 'Board I' })
  await boardI.getByTestId('race-I-0-1').click();
  await boardI.getByTestId('race-I-1-1').click();
  await boardI.getByTestId('race-I-2-1').click();
  await boardI.getByTestId('race-I-3-1').click();
  await boardI.getByTestId('race-I-4-1').click();
  await boardI.getByTestId('race-I-5-1').click();
  const boardII = page.getByRole('table').filter({ hasText: 'Board II' })
  await boardII.getByTestId('race-II-0-1').click();
  await boardII.getByTestId('race-II-1-1').click();
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
  await expect(page.getByRole('main')).toContainText('1st');
  await expect(page.getByRole('main')).toContainText('9th');
});
