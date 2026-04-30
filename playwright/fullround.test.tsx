import { test as base } from '@playwright/test';
import { ResultsHelper } from './fixtures/results-helper';
import { RoundSetup } from './fixtures/round-setup';

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

test.describe('Full round simulation', {
  tag: "@slow",
}, () => {
  if (process.env.PLAYWRIGHT_NO_PARALLEL == 'true') {
    test.describe.configure({ mode: 'default' });
  }

  test.beforeEach(async ({ page, roundSetup }) => {
    await page.goto('/krm-ui');
    await roundSetup.resetData();
  });

  type TestCase = {
    teams: number;
    stage1: string[],
    stage2?: string[],
    knockouts?: number[],
  }

  const noTeamsTestCase: TestCase = {
    teams: 0,
    stage1: [],
  }

  const testCases: TestCase[] = [
    {
      teams: 1,
      stage1: ['A'],
    },
    {
      teams: 2,
      stage1: ['A'],
    },
    {
      teams: 3,
      stage1: ['A'],
    },
    {
      teams: 4,
      stage1: ['A'],
    },
    {
      teams: 5,
      stage1: ['A'],
    },
    {
      teams: 6,
      stage1: ['A'],
    },
    {
      teams: 7,
      stage1: ['A', 'B'],
      stage2: ['I', 'II'],
    },
    {
      teams: 8,
      stage1: ['A', 'B'],
      stage2: ['I', 'II'],
      knockouts: [1, 3, 5, 7],
    },
    {
      teams: 9,
      stage1: ['A', 'B', 'C'],
      stage2: ['I', 'II', 'III'],
      knockouts: [1, 3, 5],
    },
    {
      teams: 10,
      stage1: ['A', 'B', 'C'],
      stage2: ['I', 'II', 'III'],
      knockouts: [1, 3, 5],
    },
    {
      teams: 11,
      stage1: ['A', 'B', 'C'],
      stage2: ['I', 'II', 'III'],
      knockouts: [1, 3, 5, 7],
    },
    {
      teams: 12,
      stage1: ['A', 'B', 'C', 'D'],
      stage2: ['I', 'II', 'III'],
      knockouts: [1, 3, 5, 7],
    },
    {
      teams: 13,
      stage1: ['A', 'B', 'C'],
      stage2: ['I', 'II', 'III', 'IV'],
      knockouts: [1, 3, 5, 7, 9, 11],
    },
    {
      teams: 14,
      stage1: ['A', 'B', 'C', 'D'],
      stage2: ['I', 'II', 'III', 'IV'],
      knockouts: [1, 3, 5, 7, 9, 11, 13],
    },
    {
      teams: 15,
      stage1: ['A', 'B', 'C', 'D'],
      stage2: ['I', 'II', 'III', 'IV'],
      knockouts: [1, 3, 5, 7, 9, 11, 13],
    },
    {
      teams: 16,
      stage1: ['A', 'B', 'C', 'D'],
      stage2: ['I', 'II', 'III', 'IV'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    {
      teams: 17,
      stage1: ['A', 'B', 'C', 'D', 'E'],
      stage2: ['I', 'II', 'III', 'IV'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15],
    },
    {
      teams: 18,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17],
    },
    {
      teams: 19,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17],
    },
    {
      teams: 20,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19],
    },
    {
      teams: 21,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 8, 10, 12, 15, 17, 19],
    },
    {
      teams: 22,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 8, 10, 12, 15, 17, 19, 21],
    },
    {
      teams: 23,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 8, 10, 12, 15, 17, 19, 21],
    },
    {
      teams: 24,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    },
    {
      teams: 25,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    },
    {
      teams: 26,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25],
    },
    {
      teams: 27,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    },
    {
      teams: 28,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
      knockouts: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26],
    },
    {
      teams: 29,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
      knockouts: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 28],
    },
    {
      teams: 30,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
    },
    {
      teams: 31,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29],
    },
    {
      teams: 32,
      stage1: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
      stage2: ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'],
      knockouts: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31],
    },
  ]

  const runTest = async (
    title: string,
    mixed: TestCase,
    ladies: TestCase,
    board: TestCase,
  ) => test(title, async ({ roundSetup, resultsHelper }) => {
    // Adjust timeout based on total teams
    const totalTeams = mixed.teams + ladies.teams + board.teams;
    const timeout = Math.max(30000, totalTeams * 3000);
    test.setTimeout(timeout);

    const mixedClub = 'Bath';
    const ladiesClub = 'Plymouth';
    const boardClub = 'Bristol';
    const config = {
      [mixedClub]: { mixed: mixed.teams, ladies: 0, board: 0 },
      [ladiesClub]: { mixed: 0, ladies: ladies.teams, board: 0 },
      [boardClub]: { mixed: 0, ladies: 0, board: board.teams },
    }

    await roundSetup.setupRound(config);
    resultsHelper.init(config);

    // Stage 1
    await resultsHelper.startStage1();
    await resultsHelper.viewMiniLeagues();

    // Mixed stage 1
    for (const group of mixed.stage1) {
      await resultsHelper.setWinnersByTeamName("Mixed", group, mixedClub);
    }

    // Ladies stage 1
    for (const group of ladies.stage1) {
      await resultsHelper.setWinnersByTeamName("Ladies", group, ladiesClub);
    }

    // Board stage 1
    for (const group of board.stage1) {
      await resultsHelper.setWinnersByTeamName("Board", group, boardClub);
    }

    // Stage 2
    if (mixed.stage2 || ladies.stage2 || board.stage2) {
      await resultsHelper.startStage2();


      // Mixed stage 2
      for (const group of mixed.stage2 ?? []) {
        await resultsHelper.setWinnersByTeamName("Mixed", group, mixedClub);
      }

      // Ladies stage 2
      for (const group of ladies.stage2 ?? []) {
        await resultsHelper.setWinnersByTeamName("Ladies", group, ladiesClub);
      }

      // Board stage 2
      for (const group of board.stage2 ?? []) {
        await resultsHelper.setWinnersByTeamName("Board", group, boardClub);
      }
    }

    // Knockouts
    if (mixed.knockouts || ladies.knockouts || board.knockouts) {
      await resultsHelper.startKnockouts();

      // Mixed Knockouts
      await resultsHelper.setKnockoutWinnersByTeamName("Mixed", mixedClub, mixed.knockouts);

      // Ladies Knockouts
      await resultsHelper.setKnockoutWinnersByTeamName("Ladies", ladiesClub, ladies.knockouts);

      // Board Knockouts
      await resultsHelper.setKnockoutWinnersByTeamName("Board", boardClub, board.knockouts);
    }

    // Results
    await resultsHelper.finishRaces();

    // Mixed results
    await resultsHelper.verifyResults('Mixed', mixedClub, mixed.teams);

    // Ladies results
    await resultsHelper.verifyResults('Ladies', ladiesClub, ladies.teams);

    // Board results
    await resultsHelper.verifyResults('Board', boardClub, board.teams);
  });

  testCases.forEach((mixed) => {
    // dummy ladies and board config so we have more isolated tests
    // eventually we will move to having 0 teams for these divisions
    // for test purposes once supported
    runTest(`${mixed.teams} teams`, mixed, noTeamsTestCase, noTeamsTestCase);
  })

  runTest('Realistic: mixed 18, ladies 12, board 6',
    testCases[17], testCases[11], testCases[5])
})
