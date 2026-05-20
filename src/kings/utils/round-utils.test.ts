import { describe, expect, it } from "vitest";
import { asKnockoutPosition, asPosition, calcTeamResults, checkStage, collapseRaces, createRound, isStage, minileagueRaces, orderSeeds } from "./round-utils";
import type { Division, LeagueData, MiniLeagueTemplate, Race, RoundConfig } from "../types";

const testTemplate3: MiniLeagueTemplate = {
  teams: 3,
  races: [
    [0, 1],
    [1, 2],
    [2, 0],
  ],
}

describe("round-utils", () => {
  describe("checkStage", () => {
    ["stage1", "stage2", "knockout"].forEach(s =>
      it(`"${s}" is stage`, () => {
        expect(checkStage(s)).toEqual(true)
      })
    );

    ["complete", "abandoned", "", "  ", null, undefined, {}, [], ["stage1"]].forEach(s =>
      it(`"${s}" is not stage`, () => {
        expect(checkStage(s)).toEqual(false)
      })
    )
  })

  describe("isStage", () => {
    ["stage1", "stage2", "knockout"].forEach(s =>
      it(`${s} check stage`, () => {
        expect(isStage(s)).toEqual(s)
      })
    );

    ["complete", "abandoned", "", "  ", null, undefined].forEach(s =>
      it(`"${s}" is not check stage`, () => {
        expect(isStage(s)).toEqual(null)
      })
    )
  })

  describe("asPosition", () => {
    const notTH = {
      1: "1st",
      2: "2nd",
      3: "3rd",
      21: "21st",
      22: "22nd",
      23: "23rd",
      31: "31st",
      32: "32nd",
      33: "33rd",
      41: "41st",
      42: "42nd",
      43: "43rd",
    }
    for (let i = 1; i <= 50; i++) {
      const expected = notTH[i] ?? `${i}th`
      it(`${i} as position is ${expected}`, () => {
        expect(asPosition(i)).toEqual(expected)
      })
    }
  })

  describe("asKnockoutPosition", () => {
    const notTH = {
      1: "1st/2nd",
      2: "2nd/3rd",
      3: "3rd/4th",
      20: "20th/21st",
      21: "21st/22nd",
      22: "22nd/23rd",
      23: "23rd/24th",
      30: "30th/31st",
      31: "31st/32nd",
      32: "32nd/33rd",
      33: "33rd/34th",
      40: "40th/41st",
      41: "41st/42nd",
      42: "42nd/43rd",
      43: "43rd/44th",
      50: "50th/51st",
    }

    for (let i = 1; i <= 50; i++) {
      const expected = notTH[i] ?? `${i}th/${i + 1}th`
      it(`${i} as knockout position is ${expected}`, () => {
        expect(asKnockoutPosition(i)).toEqual(expected)
      })
    }
  })

  describe("orderSeeds", () => {
    const config: LeagueData = {
      bath: {
        teams: {
          mixed: {
            "bath 1": {
              results: [[1, 15], [1, 15], [5, 9], [6, 8]],
              total: 47,
            },
            "bath 2": {
              results: [],
              total: 0,
            },
          }
        }
      },
      bristol: {
        teams: {
          mixed: {
            "bristol 1": {
              results: [[6, 8], [5, 9], [1, 15], [1, 15]],
              total: 47,
            },
            "bristol 2": {
              results: [],
              total: 0,
            },
          }
        }
      },
      cardiff: {
        teams: {
          mixed: {
            "cardiff 1": {
              results: [],
              total: 0,
            },
            "cardiff 2": {
              results: [],
              total: 0,
            },
          }
        }
      },
      exeter: {
        teams: {
          mixed: {
            "exeter 1": {
              results: [[2, 13], [2, 13], [6, 8], [2, 13]],
              total: 47,
            },
          }
        }
      },
      plymouth: {
        teams: {
          mixed: {
            "plymouth 1": {
              results: [],
              total: 0,
            },
            "plymouth 2": {
              results: [],
              total: 0,
            },
          }
        }
      },
      zzzz: {
        teams: {
          mixed: {
            "zzzz 1": {
              results: [[100, 1]],
              total: 1,
            },
          }
        }
      },
    }

    it("No config orders to empty seeds", () => {
      const actual = orderSeeds(undefined, {})
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: [],
      })
    })

    it("Empty config orders to empty seeds", () => {
      const actual = orderSeeds({}, {})
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: [],
      })
    })

    it("Empty teams orders to empty seeds", () => {
      const actual = orderSeeds(config, {})
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: [],
      })
    })

    it("Teams no results order by rank then name", () => {
      const actual = orderSeeds(config, {
        cardiff: {
          mixed: 2,
          ladies: 0,
          board: 0,
        },
        plymouth: {
          mixed: 2,
          ladies: 0,
          board: 0,
        },
      })
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: ["cardiff 1", "plymouth 1", "cardiff 2", "plymouth 2"],
      })
    })

    it("Teams no results order by rank then name after teams with results", () => {
      const actual = orderSeeds(config, {
        cardiff: {
          mixed: 2,
          ladies: 0,
          board: 0,
        },
        plymouth: {
          mixed: 2,
          ladies: 0,
          board: 0,
        },
        zzzz: {
          mixed: 1,
          ladies: 0,
          board: 0,
        },
      })
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: ["zzzz 1", "cardiff 1", "plymouth 1", "cardiff 2", "plymouth 2"],
      })
    })

    it("Drawn teams ordered by highest result, then latest result", () => {
      const actual = orderSeeds(config, {
        bath: {
          mixed: 1,
          ladies: 0,
          board: 0,
        },
        bristol: {
          mixed: 1,
          ladies: 0,
          board: 0,
        },
        exeter: {
          mixed: 1,
          ladies: 0,
          board: 0,
        },
      })
      expect(actual).toEqual({
        board: [],
        ladies: [],
        mixed: ["bristol 1", "bath 1", "exeter 1"],
      })
    })
  })

  describe("collapseRaces", () => {
    const createRace = (team1: string, team2: string): Race => ({
      division: "mixed",
      stage: "stage1",
      group: "A",
      groupRace: 1,
      teamMlIndices: [0, 1],
      team1,
      team2,
    })

    it("empty no collapse is empty", () => {
      expect(collapseRaces([], false)).toEqual([])
    })

    it("empty collapse is empty", () => {
      expect(collapseRaces([], true)).toEqual([])
    })

    it("races no collapse group per races", () => {
      const races = [
        createRace("team1", "team2"),
        createRace("team3", "team4"),
        createRace("team1", "team3"),
        createRace("team2", "team4"),
        createRace("team1", "team4"),
        createRace("team2", "team3"),
      ]
      const expected = races.map((r) => [r])
      expect(collapseRaces(races, false)).toEqual(expected)
    })

    it("races collapse group correctly", () => {
      const races = [
        createRace("team1", "team2"),
        createRace("team3", "team4"),
        createRace("team1", "team3"),
        createRace("team2", "team4"),
        createRace("team1", "team4"),
        createRace("team2", "team3"),
      ]
      const expected = [
        [
          createRace("team1", "team2"),
          createRace("team3", "team4"),
        ],
        [
          createRace("team1", "team3"),
          createRace("team2", "team4"),
        ],
        [
          createRace("team1", "team4"),
          createRace("team2", "team3"),
        ],
      ]
      expect(collapseRaces(races, true)).toEqual(expected)
    })
  })

  describe("calcTeamResults", () => {
    function createRace(team1: string, team2: string, winner?: 1 | 2): Race {
      return {
        division: "mixed",
        stage: "stage1",
        group: "A",
        groupRace: 1,
        teamMlIndices: [0, 1],
        team1,
        team2,
        winner,
      }
    }

    it("No teams and races is no results", () => {
      const actual = calcTeamResults([], [])
      expect(actual).toEqual({
        pos: [],
        data: {},
      })
    })

    it("All races complete, finished, ordered", () => {
      const testTeams = ["team1", "team2", "team3"]
      const actual = calcTeamResults(testTeams, [
        createRace("team1", "team2", 1),
        createRace("team1", "team3", 1),
        createRace("team2", "team3", 1),
      ])

      expect(actual).toEqual({
        pos: [
          ["team1"],
          ["team2"],
          ["team3"],
        ],
        data: {
          team1: {
            wins: 2,
            finished: true,
          },
          team2: {
            wins: 1,
            finished: true,
          },
          team3: {
            wins: 0,
            finished: true
          },
        }
      })
    })

    it("All races complete, finished, drawn", () => {
      const testTeams = ["team1", "team2", "team3"]
      const actual = calcTeamResults(testTeams, [
        createRace("team1", "team2", 1),
        createRace("team1", "team3", 2),
        createRace("team2", "team3", 1),
      ])

      expect(actual).toEqual({
        pos: [
          ["team1", "team2", "team3"],
        ],
        data: {
          team1: {
            wins: 1,
            finished: true,
          },
          team2: {
            wins: 1,
            finished: true,
          },
          team3: {
            wins: 1,
            finished: true
          },
        }
      })
    })

    it("All races complete, finished, drawn- sub group resolved", () => {
      // team 1 and team 2 both win 2 races, but team 1 beat team 2 in their head to head, so team 1 is above team 2
      // team 3 and team 4 both win 1 race, but team 3 beat team 4 in their head to head, so team 3 is above team 4
      const testTeams = ["team1", "team2", "team3", "team4"]
      const actual = calcTeamResults(testTeams, [
        createRace("team1", "team2", 1),
        createRace("team3", "team4", 1),
        createRace("team4", "team1", 1),
        createRace("team3", "team2", 2),
        createRace("team1", "team3", 1),
        createRace("team2", "team4", 1),
      ])

      expect(actual).toEqual({
        pos: [
          ["team1"],
          ["team2"],
          ["team3"],
          ["team4"],
        ],
        data: {
          team1: {
            wins: 2,
            finished: true,
          },
          team2: {
            wins: 2,
            finished: true,
          },
          team3: {
            wins: 1,
            finished: true
          },
          team4: {
            wins: 1,
            finished: true
          },
        }
      })
    })

    it("All races complete, finished, drawn- sub group and dsq resolved", () => {
      // team 1 and team 2 both win 2 races, but team 1 has a dsq so team 2 is above team 1
      // team 3 and team 4 both win 1 race, but team 3 has a dsq so team 4 is above team 3
      const testTeams = ["team1", "team2", "team3", "team4"]
      const testRaces = [
        createRace("team1", "team2", 1),
        createRace("team3", "team4", 1),
        createRace("team4", "team1", 1),
        createRace("team3", "team2", 2),
        createRace("team1", "team3", 1),
        createRace("team2", "team4", 1),
      ]
      testRaces[2].team2Dsq = true
      testRaces[4].team2Dsq = true
      const actual = calcTeamResults(testTeams, testRaces)

      expect(actual).toEqual({
        pos: [
          ["team2"],
          ["team1"],
          ["team4"],
          ["team3"],
        ],
        data: {
          team1: {
            wins: 2,
            finished: true,
          },
          team2: {
            wins: 2,
            finished: true,
          },
          team3: {
            wins: 1,
            finished: true
          },
          team4: {
            wins: 1,
            finished: true
          },
        }
      })
    })

    it("All races complete, finished, drawn - dsq resolved", () => {
      const testTeams = ["team1", "team2", "team3"]
      const testRaces = [
        createRace("team1", "team2", 1),
        createRace("team1", "team3", 2),
        createRace("team2", "team3", 1),
      ]
      testRaces[2].team2Dsq = true

      const actual = calcTeamResults(testTeams, testRaces)

      expect(actual).toEqual({
        pos: [
          ["team1"],
          ["team2"],
          ["team3"],
        ],
        data: {
          team1: {
            wins: 1,
            finished: true,
          },
          team2: {
            wins: 1,
            finished: true,
          },
          team3: {
            wins: 1,
            finished: true
          },
        }
      })
    })

    it("All races complete - double dsq", () => {
      const testTeams = ["team1", "team2", "team3"]
      const testRaces = [
        createRace("team1", "team2", 1),
        createRace("team1", "team3", 2),
        createRace("team2", "team3", 1),
      ]
      testRaces[2].team1Dsq = true
      testRaces[2].team2Dsq = true
      const actual = calcTeamResults(testTeams, testRaces)

      expect(actual).toEqual({
        pos: [
          ["team1"],
          ["team2"],
          ["team3"],
        ],
        data: {
          team1: {
            wins: 1,
            finished: true,
          },
          team2: {
            wins: 1,
            finished: true,
          },
          team3: {
            wins: 1,
            finished: true,
          },
        }
      })
    })

    it("Some races complete", () => {
      const testTeams = ["team1", "team2", "team3"]
      const actual = calcTeamResults(testTeams, [
        createRace("team1", "team2", 1),
        createRace("team1", "team3", 1),
        createRace("team2", "team3"),
      ])

      expect(actual).toEqual({
        pos: [
          ["team1"],
          ["team2", "team3"],
        ],
        data: {
          team1: {
            wins: 2,
            finished: true,
          },
          team2: {
            wins: 0,
            finished: false,
          },
          team3: {
            wins: 0,
            finished: false
          },
        }
      })
    })
  })

  describe("createRound", () => {
    const testId = "round-id"
    const testLeague = "western"
    const testDetailsNoLeague = {
      round: "1",
      description: "description",
      season: "2026",
      venue: "Mount Glos"
    } as const

    const testDetails = {
      ...testDetailsNoLeague,
      league: testLeague,
    } as const

    const emptySeeding = {
      mixed: [],
      ladies: [],
      board: [],
    }

    const zeroConfig: RoundConfig = {
      stage1: [],
      results: [],
    }

    const oneConfig: RoundConfig = {
      stage1: [
        {
          name: "A",
          seeds: [
            {
              group: "seed",
              position: 0,
            }
          ],
          template: {
            teams: 1,
            races: []
          }
        }
      ],
      results: [],
    }

    const threeConfig: RoundConfig = {
      stage1: [
        {
          name: "A",
          seeds: [
            {
              group: "seed",
              position: 0,
            },
            {
              group: "seed",
              position: 1,
            },
            {
              group: "seed",
              position: 2,
            },
          ],
          template: testTemplate3
        }
      ],
      results: [],
    }

    const testConfigs: Record<number, RoundConfig> = {
      0: zeroConfig,
      1: oneConfig,
      3: threeConfig,
    }

    it("no config, has defaults", () => {
      const {
        id,
        league,
        details: {
          date,
          ...actualDetails
        },
        owner,
        status,
        config,
        races,
        teams,
        distributionOrder,
      } = createRound(testId, testDetails, emptySeeding, testConfigs)
      expect(id).toEqual(testId)
      expect(league).toEqual(testLeague)
      expect(actualDetails).toEqual(testDetailsNoLeague)
      expect(date).toBeInstanceOf(Date)
      expect(status).toEqual("stage1")
      expect(owner).toEqual("local")
      expect(races).toEqual({
        stage1: {
          mixed: {},
          ladies: {},
          board: {},
        }
      })
      expect(teams).toEqual({
        mixed: [],
        ladies: [],
        board: [],
      })
      expect(distributionOrder).toEqual({
        mixed: [],
        ladies: [],
        board: [],
      })
      expect(config).toEqual({
        mixed: zeroConfig,
        ladies: zeroConfig,
        board: zeroConfig,
      })
    })

    it("1 team no races", () => {
      const round = createRound(testId, testDetails, {
        mixed: ["team1"],
        ladies: ["team2"],
        board: ["team3"],
      }, testConfigs)
      const asserter = new RoundAsserter(round)
      asserter
        .expectConfig({
          mixed: oneConfig,
          ladies: oneConfig,
          board: oneConfig,
        })
        .expectRaces('mixed', ["team1"], {
          A: [],
        }, { expectedComplete: true, expectedResults: [["team1"]] })
        .expectRaces('ladies', ["team2"], {
          A: [],
        }, { expectedComplete: true, expectedResults: [["team2"]] })
        .expectRaces('board', ["team3"], {
          A: [],
        }, { expectedComplete: true, expectedResults: [["team3"]] })
    })

    it("seeding applied to template", () => {
      const testSeeding = {
        mixed: ["team1", "team2", "team3"],
        ladies: ["team4", "team5", "team6"],
        board: ["team7", "team8", "team9"],
      }
      const actual = createRound(testId, testDetails, testSeeding, testConfigs)
      const asserter = new RoundAsserter(actual)
      asserter
        .expectTeams(testSeeding)
        .expectDistributionOrder(testSeeding)
        .expectConfig({
          mixed: threeConfig,
          ladies: threeConfig,
          board: threeConfig,
        })
        .expectRaces('mixed', testSeeding.mixed, {
          A: [
            ["team1", "team2"],
            ["team2", "team3"],
            ["team3", "team1"],
          ]
        })
        .expectRaces('ladies', testSeeding.ladies, {
          A: [
            ["team4", "team5"],
            ["team5", "team6"],
            ["team6", "team4"],
          ]
        })
        .expectRaces('board', testSeeding.board, {
          A: [
            ["team7", "team8"],
            ["team8", "team9"],
            ["team9", "team7"],
          ]
        })
    })

    it("distribution order takes priority over seeding", () => {
      const testSeeding = {
        mixed: ["team1", "team2", "team3"],
        ladies: ["team4", "team5", "team6"],
        board: ["team7", "team8", "team9"],
      }
      const testDistributionOrder = {
        mixed: ["team3", "team2", "team1"],
        ladies: ["team6", "team4", "team5"],
        board: ["team8", "team9", "team7"],
      }
      const round = createRound(testId, testDetails, testSeeding, testConfigs, testDistributionOrder)
      const asserter = new RoundAsserter(round)
      asserter
        .expectTeams(testSeeding)
        .expectDistributionOrder(testDistributionOrder)
        .expectConfig({
          mixed: threeConfig,
          ladies: threeConfig,
          board: threeConfig,
        })
        .expectRaces('mixed', testDistributionOrder.mixed, {
          A: [
            ["team3", "team2"],
            ["team2", "team1"],
            ["team1", "team3"],
          ]
        })
        .expectRaces('ladies', testDistributionOrder.ladies, {
          A: [
            ["team6", "team4"],
            ["team4", "team5"],
            ["team5", "team6"],
          ]
        })
        .expectRaces('board', testDistributionOrder.board, {
          A: [
            ["team8", "team9"],
            ["team9", "team7"],
            ["team7", "team8"],
          ]
        })
    })
  })

  describe("minileagueRaces", () => {
    it("no races if empty configuration", () => {
      const emptyTemplate = {
        teams: 0,
        races: []
      }
      const actual = minileagueRaces(emptyTemplate, [], 'A', 'stage1', 'mixed')
      expect(actual).toEqual([])
    })

    it("correct races with configuration", () => {
      const testStage = 'stage1'
      const testGroup = 'A'
      const testDivision = 'mixed'
      const actual = minileagueRaces(testTemplate3, ["t1", "t2", "t3"], testGroup, testStage, testDivision)
      expect(actual).toEqual([
        {
          division: testDivision,
          stage: testStage,
          group: testGroup,
          groupRace: 0,
          teamMlIndices: [0, 1],
          team1: "t1",
          team2: "t2",
        },
        {
          division: testDivision,
          stage: testStage,
          group: testGroup,
          groupRace: 1,
          teamMlIndices: [1, 2],
          team1: "t2",
          team2: "t3",
        },
        {
          division: testDivision,
          stage: testStage,
          group: testGroup,
          groupRace: 2,
          teamMlIndices: [2, 0],
          team1: "t3",
          team2: "t1",
        }
      ])
    })
  })
})

type Round = ReturnType<typeof createRound>
class RoundAsserter {
  constructor(
    private actual: Round,
  ) { }

  expectDetails(expected: Omit<Round["details"], "date">) {
    const { details: { date, ...actualDetails } } = this.actual
    expect(actualDetails).toEqual(expected)
    expect(date).toBeInstanceOf(Date)
    return this
  }

  expectStatus(expected: Round["status"]) {
    const { status } = this.actual
    expect(status).toEqual(expected)
    return this
  }

  expectOwner(expected: Round["owner"]) {
    const { owner } = this.actual
    expect(owner).toEqual(expected)
    return this
  }

  expectLeague(expected: Round["league"]) {
    const { league } = this.actual
    expect(league).toEqual(expected)
    return this
  }

  expectTeams(expected: Round["teams"]) {
    const { teams } = this.actual
    expect(teams).toEqual(expected)
    return this
  }

  expectDistributionOrder(expected: Round["distributionOrder"]) {
    const { distributionOrder } = this.actual
    expect(distributionOrder).toEqual(expected)
    return this
  }

  expectConfig(expected: Round["config"]) {
    const { config } = this.actual
    expect(config).toEqual(expected)
    return this
  }

  expectRaces(division: Division, expectedTeams: string[], expectedRaces: {
    [group: string]: [string, string][],
  }, options?: {
    expectedComplete?: boolean,
    expectedResults?: string[][],
  }) {
    Object.entries(expectedRaces).forEach(([group, expectedGroupRaces]) => {
      const actualGroupRaces = this.actual.races.stage1[division][group]
      expect(actualGroupRaces).toBeDefined()
      const {
        races,
        teams,
        complete,
        conflict,
        results,
      } = actualGroupRaces
      expect(teams).toEqual(expectedTeams)
      expect(complete).toEqual(options?.expectedComplete ?? false)
      expect(conflict).toEqual(false)
      expect(results).toEqual(options?.expectedResults ?? undefined)
      races.forEach((race, index) => {
        const [expectedTeam1, expectedTeam2] = expectedGroupRaces[index]
        expect(race).toBeDefined()
        expect(race.division).toEqual(division)
        expect(race.group).toEqual(group)
        expect(race.team1).toEqual(expectedTeam1)
        expect(race.team2).toEqual(expectedTeam2)
        const actualIndices = [teams.indexOf(expectedTeam1), teams.indexOf(expectedTeam2)]
        expect(race.teamMlIndices).toEqual(actualIndices)
      })
    })
    return this
  }
}
