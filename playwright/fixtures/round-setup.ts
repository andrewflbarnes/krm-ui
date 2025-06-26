import { Page, Locator, expect } from '@playwright/test';

export class RoundSetup {
  private teamEntry: Record<string, Locator> = {};

  constructor(public readonly page: Page) {
  }

  async resetData() {
    await expect(this.page.getByText('Reset Data')).toBeVisible();
    await this.page.getByRole('button', { name: 'reset data' }).click();
    await expect(this.page.getByText('are you sure')).toBeVisible();
    await this.page.getByText('yes').click();
    await this.page.getByRole('link', { name: 'Teams' }).click();
    await this.page.getByRole('button', { name: 'Load config' }).click();
    await expect(this.page.getByText('Config loaded for ')).toBeVisible();
  }

  async setupRound(clubs: Record<string, { mixed: number, ladies: number, board: number }>) {
    // Create new round
    await this.goToNewRound();

    // Info step - todo

    // Add teams step
    // Add new test club with 7, 8 and 9 teams
    this.next();
    for (const [club, counts] of Object.entries(clubs)) {
      await this.createTeam(club);
      await this.addMixed(club, counts.mixed);
      await this.addLadies(club, counts.ladies);
      await this.addBoard(club, counts.board);
    }

    // Missing teams step
    await this.next();
    await this.validateMissingTeams();

    // Team swap step
    await this.next();
    await this.validateTeamSwap();

    // Summary step
    await this.next({ x: 10, y: 10 });
    await this.validateSummary();

    // Finish creating the round
    await this.done();
  }

  async goToNewRound() {
    await this.page.getByRole('link', { name: 'Race' }).click();
    await this.page.getByRole('link', { name: 'New' }).click();
  }

  async createTeam(teamName: string) {
    const addClub = this.page.getByTestId('add-team').locator('input')
    await addClub.click();
    await addClub.fill(teamName);
    await this.page.getByTestId('add-team').getByRole('button').click();

    this.teamEntry[teamName] = this.page.getByRole('row', { name: teamName });
  }

  private async addTeam(teamName: string, count: number, index: number) {
    const clubRow = this.teamEntry[teamName];

    if (!clubRow) {
      throw new Error(`Team ${teamName} not found, createTeam first`);
    }

    const teams = clubRow.locator('input').nth(index)
    if (!teams) {
      throw new Error(`Input for team ${teamName} at index ${index} not found`);
    }
    await teams.click();
    await teams.fill(`${count}`);
  }

  async addMixed(teamName: string, count: number) {
    await this.addTeam(teamName, count, 0);
  }

  async addLadies(teamName: string, count: number) {
    await this.addTeam(teamName, count, 1);
  }

  async addBoard(teamName: string, count: number) {
    await this.addTeam(teamName, count, 2);
  }

  async next(position?: { x: number, y: number }) {
    await this.page.getByRole('button', { name: 'Next' }).click({
      position,
    });
  }

  async done(position?: { x: number, y: number }) {
    await this.page.getByRole('button', { name: 'Done' }).click({
      position,
    });
  }

  async validateMissingTeams() {
    await expect(this.page.locator('h3')).toContainText('Missing teams');
  }

  async validateTeamSwap() {
    await expect(this.page.getByRole('heading', { name: 'Mixed' })).toBeAttached()
  }

  async validateSummary() {
    await expect(this.page.getByRole('heading', { name: 'Mixed' })).toBeAttached()
  }
}
