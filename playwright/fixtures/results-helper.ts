import { Page, expect } from '@playwright/test';
import { asKnockoutPosition, asPosition } from '../../src/kings/utils';

type Config = Record<string, {
  mixed: number;
  ladies: number;
  board: number;
}>

export class ResultsHelper {
  private config: Config = {};

  constructor(public readonly page: Page) {
  }

  init(config: Config) {
    this.config = config;
  }

  async startStage1() {
    await expect(this.page.getByLabel('Stage 1')).toContainText('Stage 1');
  }

  async startStage2() {
    await expect(this.page.getByRole('main')).toContainText('Start Stage 2');
    const start = this.page.getByRole('button', { name: 'Start Stage' })
    await expect(start).toBeVisible();
    await start.click();
    const confirm = this.page.getByText('Yes')
    await expect(confirm).toBeVisible();
    await confirm.click();
    await expect(this.page.getByLabel('Stage 2')).toContainText('Stage 2');
  }

  async startKnockouts() {
    await expect(this.page.getByRole('main')).toContainText('Start Knockouts');
    const start = this.page.getByRole('button', { name: 'Start Knockouts' })
    await expect(start).toBeVisible();
    await start.click();
    const confirm = this.page.getByText('Yes')
    await expect(confirm).toBeVisible();
    await confirm.click();
    await expect(this.page.getByLabel('Knockouts')).toContainText('Knockouts');
  }

  async finishRaces() {
    await expect(this.page.getByRole('main')).toContainText('Finish');
    const finish = this.page.getByRole('button', { name: 'Finish' })
    await expect(finish).toBeVisible();
    await finish.click();
    const confirm = this.page.getByText('Yes')
    await expect(confirm).toBeVisible();
    await confirm.click();
    await expect(this.page.getByLabel('Results')).toContainText('Results');
  }

  async viewMiniLeagues() {
    const view = this.page.getByRole('button', { name: 'View Race List' })
    await expect(view).toBeVisible();
    await view.click();
    const minileagues = this.page.getByText('Mini Leagues')
    await expect(minileagues).toBeVisible();
    await minileagues.click();
  }

  async setWinners(division: string, group: string, teamNumbers: (1 | 2)[]) {
    const titleLocator = this.page.getByText(`${division} ${group}`, { exact: true })
    const ml = this.page.getByRole('table').filter({ has: titleLocator })
    await expect(ml).toBeVisible();

    let raceNumber = 0;
    for (const teamNumber of teamNumbers) {
      const marker = ml.getByTestId(`race-${group}-${raceNumber}-${teamNumber}`)
      await expect(marker).toBeVisible();
      await marker.click();
      raceNumber++;
    }
  }

  // NOTE: This method relies on overclicking i.e. it will click all possible buttons
  // but expect to do so by highest seeding precedence. It relies on a team getting
  // marked as the winner disabling the competing teams button.
  async setWinnersByTeamName(division: string, group: string, club: string) {
    const titleLocator = this.page.getByText(`${division} ${group}`, { exact: true })
    const ml = this.page.getByRole('table').filter({ has: titleLocator })
    await expect(ml).toBeVisible();

    const count = this.config[club][division.toLowerCase()];

    for (let i = 1; i <= count; i++) {
      const team = `${club} ${i}`;
      const markers = ml.getByRole('row', { name: new RegExp(`${team}\\b`) }).getByRole('button')
      for (const marker of await markers.all()) {
        await marker.click();
      }
    }
  }

  async setKnockoutWinners(division: string, winners: { position: number, teamNumber: 1 | 2 }[]) {
    for (const winner of winners) {
      const positionStr = asKnockoutPosition(winner.position);
      const marker = this.page.getByRole('table')
        .filter({ hasText: `${division} ${positionStr}` })
        .getByTestId(`race-${positionStr}-0-${winner.teamNumber}`)
      await expect(marker).toBeVisible();
      marker.click();
    }
  }

  // NOTE: This method relies on overclicking i.e. it will click all possible buttons
  // but expect to do so by highest seeding precedence. It relies on a team getting
  // marked as the winner disabling the competing teams button.
  async setKnockoutWinnersByTeamName(division: string, club: string, positions: number[]) {
    if (!positions?.length) {
      return;
    }

    for (const position of positions) {
      const title = `${division} ${asKnockoutPosition(position)}`;
      const titleLocator = this.page.getByText(title, { exact: true })
      const ml = this.page.getByRole('table').filter({ has: titleLocator })
      await expect(ml).toBeVisible();
      const team = `${club} ${position}`;
      const marker = ml.getByRole('row', { name: new RegExp(`${team}\\b`) }).getByRole('button')
      await expect(marker).toBeVisible();
      await marker.click();
    }
  }

  // Note - this only supports a single club well ordered results e.g.
  // given the club "Test" and the count 10, we expect the final
  // results to be "Test 1", "Test 2", ..., "Test 10"
  async verifyResults(division: string, club: string, count: number) {
    const results = this.page.getByTestId(`results-${division.toLowerCase()}`);
    for (let i = 1; i <= count; i++) {
      await expect.soft(results.getByRole('row', { name: new RegExp(`^${asPosition(i)}`) })).toContainText(`${club} ${i}`)
    }
    await expect.soft(results.getByRole('row', { name: new RegExp(`^${asPosition(count + 1)}`) })).not.toBeAttached();
  }
}
