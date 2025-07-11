
import { describe, expect, it } from 'vitest';
import { AccResult, combineResults, Results } from './html-utils';
import { LeagueData } from '../types';

describe("combineResults", () => {
  const leagueData: LeagueData = {
    club1: {
      teams: {
        mixed: {
          "club1 mixed 1": {
            results: [[1, 40], [1, 40], [1, 40], [0, 0]],
            total: 120,
          },
          "club1 mixed 2": {
            results: [[2, 38], [2, 38], [2, 38], [0, 0]],
            total: 114,
          },
        },
        ladies: {
          "club1 ladies 1": {
            results: [[3, 36], [3, 36], [3, 36], [0, 0]],
            total: 108,
          },
        },
      },
    },
    club2: {
      teams: {
        mixed: {
          "club2 mixed 1": {
            results: [[4, 35], [4, 35], [4, 35], [0, 0]],
            total: 105,
          },
          "club2 mixed 2": {
            results: [[5, 34], [5, 34], [5, 34], [0, 0]],
            total: 102,
          },
        },
        ladies: {
          "club2 ladies 1": {
            results: [[6, 33], [6, 33], [6, 33], [0, 0]],
            total: 99,
          },
        },
      },
    },
  }

  const baseExpected = {
    mixed: {
      "club1 mixed 1": {
        club: "club1",
        name: "club1 mixed 1",
        r1: 40,
        r1place: 1,
        r2: 40,
        r2place: 1,
        r3: 40,
        r3place: 1,
        r4: 0,
        r4place: 0,
        total: 120,
      },
      "club1 mixed 2": {
        club: "club1",
        name: "club1 mixed 2",
        r1: 38,
        r1place: 2,
        r2: 38,
        r2place: 2,
        r3: 38,
        r3place: 2,
        r4: 0,
        r4place: 0,
        total: 114,
      },
      "club2 mixed 1": {
        club: "club2",
        name: "club2 mixed 1",
        r1: 35,
        r1place: 4,
        r2: 35,
        r2place: 4,
        r3: 35,
        r3place: 4,
        r4: 0,
        r4place: 0,
        total: 105,
      },
      "club2 mixed 2": {
        club: "club2",
        name: "club2 mixed 2",
        r1: 34,
        r1place: 5,
        r2: 34,
        r2place: 5,
        r3: 34,
        r3place: 5,
        r4: 0,
        r4place: 0,
        total: 102,
      },
    },
    ladies: {
      "club1 ladies 1": {
        club: "club1",
        name: "club1 ladies 1",
        r1: 36,
        r1place: 3,
        r2: 36,
        r2place: 3,
        r3: 36,
        r3place: 3,
        r4: 0,
        r4place: 0,
        total: 108,
      },
      "club2 ladies 1": {
        club: "club2",
        name: "club2 ladies 1",
        r1: 33,
        r1place: 6,
        r2: 33,
        r2place: 6,
        r3: 33,
        r3place: 6,
        r4: 0,
        r4place: 0,
        total: 99,
      },
    },
  } as const satisfies {
    [div: string]: {
      [team: string]: AccResult;
    }
  }

  const testCases: {
    title: string;
    round: number;
    results: Results;
    expected: Record<string, AccResult[]>;
  }[] = [
      {
        title: "combines a later result",
        round: 4,
        results: {
          mixed: [
            {
              rank: 1,
              points: 40,
              teams: ["club1 mixed 2"]
            },
            {
              rank: 2,
              points: 38,
              teams: ["club1 mixed 1"]
            }
          ],
          ladies: [
            {
              rank: 1,
              points: 40,
              teams: ["club2 ladies 1"]
            }
          ],
        },
        expected: {
          mixed: [
            {
              club: "club1",
              name: "club1 mixed 1",
              r1: 40,
              r1place: 1,
              r2: 40,
              r2place: 1,
              r3: 40,
              r3place: 1,
              r4: 38,
              r4place: 2,
              total: 158,
            },
            {
              club: "club1",
              name: "club1 mixed 2",
              r1: 38,
              r1place: 2,
              r2: 38,
              r2place: 2,
              r3: 38,
              r3place: 2,
              r4: 40,
              r4place: 1,
              total: 154,
            },
            baseExpected.mixed["club2 mixed 1"],
            baseExpected.mixed["club2 mixed 2"],
          ],
          ladies: [
            {
              club: "club2",
              name: "club2 ladies 1",
              r1: 33,
              r1place: 6,
              r2: 33,
              r2place: 6,
              r3: 33,
              r3place: 6,
              r4: 40,
              r4place: 1,
              total: 139,
            },
            baseExpected.ladies["club1 ladies 1"],
          ]
        }
      },
      {
        title: "overrides results correctly",
        round: 1,
        results: {
          mixed: [
            {
              rank: 4,
              points: 35,
              teams: ["club1 mixed 1"]
            }
          ]
        },
        expected: {
          mixed: [
            {
              club: "club1",
              name: "club1 mixed 1",
              r1: 35,
              r1place: 4,
              r2: 40,
              r2place: 1,
              r3: 40,
              r3place: 1,
              r4: 0,
              r4place: 0,
              total: 115,
            },
            baseExpected.mixed['club1 mixed 2'],
            baseExpected.mixed["club2 mixed 1"],
            baseExpected.mixed["club2 mixed 2"],
          ],
          ladies: [
            baseExpected.ladies["club1 ladies 1"],
            baseExpected.ladies["club2 ladies 1"],
          ]
        }
      },
      {
        title: "combines a later result on multiple teams",
        round: 4,
        results: {
          mixed: [
            {
              rank: 4,
              points: 35,
              teams: ["club1 mixed 1", "club2 mixed 1"]
            }
          ]
        },
        expected: {
          mixed: [
            {
              club: "club1",
              name: "club1 mixed 1",
              r1: 40,
              r1place: 1,
              r2: 40,
              r2place: 1,
              r3: 40,
              r3place: 1,
              r4: 35,
              r4place: 4,
              total: 155,
            },
            {
              club: "club2",
              name: "club2 mixed 1",
              r1: 35,
              r1place: 4,
              r2: 35,
              r2place: 4,
              r3: 35,
              r3place: 4,
              r4: 35,
              r4place: 4,
              total: 140,
            },
            baseExpected.mixed['club1 mixed 2'],
            baseExpected.mixed["club2 mixed 2"],
          ],
          ladies: [
            baseExpected.ladies["club1 ladies 1"],
            baseExpected.ladies["club2 ladies 1"],
          ]
        }
      },
      {
        title: "overrides results correctly on multiple teams",
        round: 1,
        results: {
          mixed: [
            {
              rank: 24,
              points: 15,
              teams: ["club1 mixed 1", "club2 mixed 1"]
            }
          ]
        },
        expected: {
          mixed: [
            baseExpected.mixed['club1 mixed 2'],
            baseExpected.mixed["club2 mixed 2"],
            {
              club: "club1",
              name: "club1 mixed 1",
              r1: 15,
              r1place: 24,
              r2: 40,
              r2place: 1,
              r3: 40,
              r3place: 1,
              r4: 0,
              r4place: 0,
              total: 95,
            },
            {
              club: "club2",
              name: "club2 mixed 1",
              r1: 15,
              r1place: 24,
              r2: 35,
              r2place: 4,
              r3: 35,
              r3place: 4,
              r4: 0,
              r4place: 0,
              total: 85,
            },
          ],
          ladies: [
            baseExpected.ladies["club1 ladies 1"],
            baseExpected.ladies["club2 ladies 1"],
          ]
        }
      },
    ]

  testCases.forEach(({
    title,
    //leagueData,
    round,
    results,
    expected,
  }) => {
    it(title, () => {
      const actual = combineResults(leagueData, round, results)
      expect(actual).toEqual(expected)
      //console.error(resultsToHtml(leagueData, round, results))
    })
  })
})
