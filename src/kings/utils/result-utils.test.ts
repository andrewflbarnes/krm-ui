import { describe, expect, it } from 'vitest';
import { kingsPoints, parseResults } from './result-utils';
import { LeagueData } from '../types';

describe("kingsPoints", () => {
  const testPositions = (division: string, start: number[], restFrom: number, min: number) => {
    describe(division, () => {
      for (let i = 1; i <= 100; i++) {
        const expected = (i <= start.length)
          ? start[i - 1]
          : Math.max(min, restFrom + start.length + 1 - i)

        it(`position ${i} is ${expected} points`, () => {
          const actual = kingsPoints(division, i)
          expect(actual).toEqual(expected)
        })
      }
    })
  }

  testPositions("mixed", [30, 28, 26], 25, 1)
  testPositions("ladies", [15, 13, 11], 10, 1)
  testPositions("board", [15, 13, 11], 10, 1)
})

describe('parseResults', () => {
  it('returns empty object for null input', () => {
    const result = parseResults(null);
    expect(result).toEqual({
      mixed: [],
      ladies: [],
      board: [],
    });
  })

  it('returns empty object for empty input', () => {
    const result = parseResults({});
    expect(result).toEqual({
      mixed: [],
      ladies: [],
      board: [],
    });
  })

  it('should parse league config correctly', () => {
    // We generate once set of test data and expects for mixed, then duplicate
    // for ladies and board to sanity check all 3 divisions
    const testConfig: LeagueData = {
      club1: {
        teams: {
          mixed: {
            // first
            "club1 mixed 1": {
              results: [[1, 40], [2, 40], [3, 40], [4, 40]],
              total: 160,
            },
            // sixth same total as second-fifth, but lower round scores
            "club1 mixed 2": {
              results: [[1, 35], [2, 30], [3, 25], [4, 20]],
              total: 110,
            },
          },
        }
      },
      club2: {
        teams: {
          mixed: {
            // second same total as sixth, but higher highest score
            "club2 mixed 1": {
              results: [[1, 40], [2, 30], [3, 25], [4, 15]],
              total: 110,
            },
            // third same total as sixth, but higher 2nd score
            "club2 mixed 2": {
              results: [[1, 35], [2, 35], [3, 25], [4, 15]],
              total: 110,
            },
            // fourth same total as sixth, but higher 3rd score
            "club2 mixed 3": {
              results: [[1, 35], [2, 30], [3, 30], [4, 15]],
              total: 110,
            },
            // fifth same total as sixth, but higher 4th score
            "club2 mixed 4": {
              results: [[1, 35], [2, 30], [3, 20], [4, 25]],
              total: 110,
            },
          },
        }
      },
      club3: {
        teams: {
          mixed: {
            // seventh no score but highest seed
            "club3 mixed 1": {
              results: [],
              total: 0,
            },
            // ninth no score and highest seed
            "club3 mixed 2": {
              results: [],
              total: 0,
            },
            // tenth no score and 10 after 2
            "club3 mixed 10": {
              results: [],
              total: 0,
            },
          },
        }
      },
      club4: {
        teams: {
          mixed: {
            // eighth no score but equal seed with club3 mixed 1 but later in alphabet
            "club4 mixed 1": {
              results: [],
              total: 0,
            },
          },
        }
      },
    }
    const fullTestConfig: LeagueData = {
      club1: {
        teams: {
          mixed: testConfig.club1.teams.mixed,
          ladies: testConfig.club1.teams.mixed,
          board: testConfig.club1.teams.mixed,
        }
      },
      club2: {
        teams: {
          mixed: testConfig.club2.teams.mixed,
          ladies: testConfig.club2.teams.mixed,
          board: testConfig.club2.teams.mixed,
        }
      },
      club3: {
        teams: {
          mixed: testConfig.club3.teams.mixed,
          ladies: testConfig.club3.teams.mixed,
          board: testConfig.club3.teams.mixed,
        }
      },
      club4: {
        teams: {
          mixed: testConfig.club4.teams.mixed,
          ladies: testConfig.club4.teams.mixed,
          board: testConfig.club4.teams.mixed,
        }
      },
    }
    const expected = [
      {
        club: 'club1',
        name: 'club1 mixed 1',
        r1: 40,
        r2: 40,
        r3: 40,
        r4: 40,
        total: 160,
      },
      {
        club: 'club2',
        name: 'club2 mixed 1',
        r1: 40,
        r2: 30,
        r3: 25,
        r4: 15,
        total: 110,
      },
      {
        club: 'club2',
        name: 'club2 mixed 2',
        r1: 35,
        r2: 35,
        r3: 25,
        r4: 15,
        total: 110,
      },
      {
        club: 'club2',
        name: 'club2 mixed 3',
        r1: 35,
        r2: 30,
        r3: 30,
        r4: 15,
        total: 110,
      },
      {
        club: 'club2',
        name: 'club2 mixed 4',
        r1: 35,
        r2: 30,
        r3: 20,
        r4: 25,
        total: 110,
      },
      {
        club: 'club1',
        name: 'club1 mixed 2',
        r1: 35,
        r2: 30,
        r3: 25,
        r4: 20,
        total: 110,
      },
      {
        club: 'club3',
        name: 'club3 mixed 1',
        r1: undefined,
        r2: undefined,
        r3: undefined,
        r4: undefined,
        total: 0
      },
      {
        club: 'club4',
        name: 'club4 mixed 1',
        r1: undefined,
        r2: undefined,
        r3: undefined,
        r4: undefined,
        total: 0
      },
      {
        club: 'club3',
        name: 'club3 mixed 2',
        r1: undefined,
        r2: undefined,
        r3: undefined,
        r4: undefined,
        total: 0
      },
      {
        club: 'club3',
        name: 'club3 mixed 10',
        r1: undefined,
        r2: undefined,
        r3: undefined,
        r4: undefined,
        total: 0
      },
    ]
    const result = parseResults(fullTestConfig);
    expect(result).toEqual({
      mixed: expected,
      ladies: expected,
      board: expected,
    });
  })
})
