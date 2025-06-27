import { Page, Locator, expect } from '@playwright/test';

export class RoundSetup {
  private teamEntry: Record<string, Locator> = {};

  constructor(public readonly page: Page) {
  }

  async resetData() {
    await expect(this.page.getByText('Reset Data')).toBeVisible();
    const reset = this.page.getByRole('button', { name: 'reset data' })
    await expect(reset).toBeVisible();
    await reset.click();
    await expect(this.page.getByText('are you sure')).toBeVisible();
    const confirm = this.page.getByText('yes')
    await expect(confirm).toBeVisible();
    await confirm.click();
    const teams = this.page.getByRole('link', { name: 'Teams' })
    await expect(teams).toBeVisible();
    await teams.click();
    const load = this.page.getByRole('button', { name: 'Load config' })
    await expect(load).toBeVisible();
    await load.click();
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
    const race = this.page.getByRole('link', { name: 'Race' })
    await expect(race).toBeVisible();
    await race.click();
    const newrace = this.page.getByRole('link', { name: 'New' })
    await expect(newrace).toBeVisible();
    await newrace.click();
  }

  async createTeam(teamName: string) {
    const addClub = this.page.getByTestId('add-team').locator('input')
    await expect(addClub).toBeVisible();
    await addClub.click();
    await addClub.fill(teamName);
    const addTeam = this.page.getByTestId('add-team').getByRole('button')
    await expect(addTeam).toBeVisible();
    await addTeam.click();

    this.teamEntry[teamName] = this.page.getByRole('row', { name: teamName });
    await expect(this.teamEntry[teamName]).toBeVisible();
  }

  private async addTeam(teamName: string, count: number, index: number) {
    const clubRow = this.teamEntry[teamName];

    if (!clubRow) {
      throw new Error(`Team ${teamName} not found, createTeam first`);
    }

    const teams = clubRow.locator('input').nth(index)
    await expect(teams).toBeVisible();
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
    const next = this.page.getByRole('button', { name: 'Next' })
    await expect(next).toBeVisible();
    await next.click({
      position,
    });
  }

  async done(position?: { x: number, y: number }) {
    const done = this.page.getByRole('button', { name: 'Done' })
    await expect(done).toBeVisible();
    await done.click({
      position,
    });
  }

  async validateMissingTeams() {
    await expect(this.page.locator('h3')).toContainText('Missing teams');
  }

  async validateTeamSwap() {
    await expect(this.page.getByRole('heading', { name: 'Mixed' })).toBeVisible()
  }

  async validateSummary() {
    await expect(this.page.getByRole('heading', { name: 'Mixed' })).toBeVisible()
  }
}
