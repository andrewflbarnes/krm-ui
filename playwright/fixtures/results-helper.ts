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
    await expect(this.page.getByLabel('Stage 1'), 'Running stage 1').toContainText('Stage 1');
  }

  async startStage2() {
    await expect(this.page.getByRole('main'), 'Can start stage 2').toContainText('Start Stage 2');
    await this.page.getByRole('button', { name: 'Start Stage' })
      .describe('Start stage 2 button')
      .click();
    await this.page.getByText('Yes')
      .describe('Confirm start button')
      .click();
    await expect(this.page.getByLabel('Stage 2'), 'Running stage 2').toContainText('Stage 2');
  }

  async startKnockouts() {
    await expect(this.page.getByRole('main'), 'Can start knockouts').toContainText('Start Knockouts');
    await this.page.getByRole('button', { name: 'Start Knockouts' })
      .describe('Start knockouts button')
      .click();
    await this.page.getByText('Yes')
      .describe('Confirm start button')
      .click();
    await expect(this.page.getByLabel('Knockouts'), 'Running knockouts').toContainText('Knockouts');
  }

  async finishRaces() {
    await expect(this.page.getByRole('main'), 'Can finish races').toContainText('Finish');
    await this.page.getByRole('button', { name: 'Finish' })
      .describe('Finish races button')
      .click();
    await this.page.getByText('Yes')
      .describe('Confirm finish button')
      .click();
    await expect(this.page.getByLabel('Results'), 'Results displayed').toContainText('Results');
  }

  async viewMiniLeagues() {
    await this.page.getByRole('button', { name: 'View Race List' })
      .describe('View mode selector')
      .click();
    await this.page.getByText('Mini Leagues')
      .describe('Mini Leagues view option')
      .click();
  }

  async setWinners(division: string, group: string, teamNumbers: (1 | 2)[]) {
    const titleLocator = this.page.getByText(`${division} ${group}`, { exact: true })
    const ml = this.page.getByRole('table').filter({ has: titleLocator })
    await expect(ml, `${division} ${group} minileague found`).toBeVisible();

    let raceNumber = 0;
    for (const teamNumber of teamNumbers) {
      await ml.getByTestId(`race-${group}-${raceNumber}-${teamNumber}`)
        .describe(`${division} ${group} race ${raceNumber} team ${teamNumber}`)
        .click();
      raceNumber++;
    }
  }

  // NOTE: This method relies on overclicking i.e. it will click all possible buttons
  // but expect to do so by highest seeding precedence. It relies on a team getting
  // marked as the winner disabling the competing teams button.
  async setWinnersByTeamName(division: string, group: string, club: string) {
    const titleLocator = this.page.getByText(`${division} ${group}`, { exact: true })
    const ml = this.page.getByRole('table').filter({ has: titleLocator })
    await expect(ml, `${division} ${group} minileague found`).toBeVisible();

    const count = this.config[club][division.toLowerCase()];

    for (let i = 1; i <= count; i++) {
      const team = `${club} ${i}`;
      const description = `${division} ${group} ${team}`
      const markers = ml.getByRole('row', { name: new RegExp(`${team}\\b`) })
        .getByRole('button')
        .describe(description);
      for (const marker of await markers.all()) {
        await marker.describe(`${description} race`).click();
      }
    }
  }

  async setKnockoutWinners(division: string, winners: { position: number, teamNumber: 1 | 2 }[]) {
    for (const winner of winners) {
      const positionStr = asKnockoutPosition(winner.position);
      await this.page.getByRole('table')
        .filter({ hasText: `${division} ${positionStr}` })
        .getByTestId(`race-${positionStr}-0-${winner.teamNumber}`)
        .describe(`${division} ${positionStr} team ${winner.teamNumber}`)
        .click();
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
      await expect(ml, `${title} knockout visible`).toBeVisible();
      const team = `${club} ${position}`;
      await ml.getByRole('row', { name: new RegExp(`${team}\\b`) }).getByRole('button')
        .describe(`${title} ${team}`)
        .click();
    }
  }

  // Note - this only supports a single club well ordered results e.g.
  // given the club "Test" and the count 10, we expect the final
  // results to be "Test 1", "Test 2", ..., "Test 10"
  async verifyResults(division: string, club: string, count: number) {
    const results = this.page.getByTestId(`results-${division.toLowerCase()}`);
    for (let i = 1; i <= count; i++) {
      const position = asPosition(i);
      await expect.soft(results.getByRole('row', { name: new RegExp(`^${position}`) }), `${division} ${position} should be ${club} ${i}`)
        .toContainText(`${club} ${i}`);
    }
    const position = asPosition(count + 1)
    await expect.soft(results.getByRole('row', { name: new RegExp(`^${position}`) }), `No ${position} or later positions`).not.toBeAttached();
  }
}
