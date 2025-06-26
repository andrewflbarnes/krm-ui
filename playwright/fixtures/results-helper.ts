import { Page, expect } from '@playwright/test';
import { asKnockoutPosition, asPosition } from '../../src/kings/utils';

export class ResultsHelper {
  constructor(public readonly page: Page) {
  }

  async startStage1() {
    await expect(this.page.getByLabel('Stage 1')).toContainText('Stage 1');
  }

  async startStage2() {
    await expect(this.page.getByRole('main')).toContainText('Start Stage 2');
    await this.page.getByRole('button', { name: 'Start Stage' }).click();
    await this.page.getByText('Yes').click();
    await expect(this.page.getByLabel('Stage 2')).toContainText('Stage 2');
  }

  async startKnockouts() {
    await expect(this.page.getByRole('main')).toContainText('Start Knockouts');
    await this.page.getByRole('button', { name: 'Start Knockouts' }).click();
    await this.page.getByText('Yes').click();
    await expect(this.page.getByLabel('Knockouts')).toContainText('Knockouts');
  }

  async finishRaces() {
    await expect(this.page.getByRole('main')).toContainText('Finish');
    await this.page.getByRole('button', { name: 'Finish' }).click();
    await this.page.getByText('Yes').click();
    await expect(this.page.getByLabel('Results')).toContainText('Results');
  }

  async viewMiniLeagues() {
    await this.page.getByRole('button', { name: 'View Race List' }).click();
    await this.page.getByText('Mini Leagues').click();
  }

  async setWinners(division: string, group: string, teamNumbers: (1 | 2)[]) {
    const titleLocator = this.page.getByText(`${division} ${group}`, { exact: true })
    const ml = this.page.getByRole('table').filter({ has: titleLocator })
    await expect(ml).toBeAttached();

    let raceNumber = 0;
    for (const teamNumber of teamNumbers) {
      await ml.getByTestId(`race-${group}-${raceNumber}-${teamNumber}`).click();
      raceNumber++;
    }
  }

  async setKnockoutWinners(division: string, winners: { position: number, teamNumber: 1 | 2 }[]) {
    for (const winner of winners) {
      const positionStr = asKnockoutPosition(winner.position);
      await this.page.getByRole('table')
        .filter({ hasText: `${division} ${positionStr}` })
        .getByTestId(`race-${positionStr}-0-${winner.teamNumber}`)
        .click();
    }
  }

  // Note - this only supports a single club well ordered results e.g.
  // given the club "Test" and the count 10, we expect the final
  // results to be "Test 1", "Test 2", ..., "Test 10"
  async verifyResults(division: string, club: string, count: number) {
    const results = this.page.getByTestId(`results-${division.toLowerCase()}`);
    for (let i = 1; i <= count; i++) {
      await expect(results.getByRole('row', { name: asPosition(i) })).toContainText(`${club} ${i}`)
    }
  }
}
