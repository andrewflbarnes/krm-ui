import { divisions, Division, League, LeagueData, Race, raceConfig, RoundConfig, RoundSeeding, Round, StageRaces, RoundResult, asKnockoutId, RaceStage } from "../kings"
import { calcTeamResults, createRound } from "../kings/round-utils";

export type RoundInfo = Omit<Round, "races">

export type KrmApi = {
  saveLeagueConfig(league: League, config: LeagueData): void;
  getLeagueConfig(league: League): LeagueData | null;
  createRound(league: League, teams: RoundSeeding, distributionOrder?: RoundSeeding): Round;
  getRounds(league?: string): RoundInfo[];
  getRound(id: string): Round;
  deleteRound(id: string): void;
  updateRace(id: string, race: Race): void;
  progressRound(id: string): void;
  reopenStage(id: string, stage: RaceStage): void;
}

export default (function krmApiLocalStorage(): KrmApi {
  function getStorageKeyRounds() {
    return "kings-round-ids"
  }

  function getStorageKeyLeagueConfig(league: League) {
    return `kings-${league}-config`
  }

  function newStorageKeyRound(league: League) {
    return `${league}-${new Date().getTime()}`
  }

  function saveRound(round: Round) {
    localStorage.setItem(round.id, JSON.stringify(round))
    const keyRoundIds = getStorageKeyRounds()
    let roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
    roundIds = roundIds.filter(rid => rid !== round.id)
    roundIds.push(round.id)
    localStorage.setItem(keyRoundIds, JSON.stringify(roundIds))
  }

  function progressRoundStage(round: Round, status: "stage1" | "stage2", nextStatus: "stage2" | "knockout") {
    const races: StageRaces = round.races[status]
    if (!races) {
      const err = `No races exist for stage ${status} - cannot progress`
      console.error(err, round.races)
      throw new Error(err)
    }

    if (!Object.values(round.config).some(division => division[nextStatus])) {
      if (nextStatus === "stage2") {
        return progressRoundStage(round, status, "knockout")
      }
      return completeRound(round)
    }

    const ready = Object.values(races)
      .every(divRaces => Object.values(divRaces)
        .every(groupRaces => groupRaces.complete && !groupRaces.conflict))
    if (!ready) {
      const err = `Races for ${status} are incomplete or results conflict - cannot progress`
      console.error(err, round.races)
      throw new Error(err)
    }

    const { teams } = round

    const config = Object.entries(teams).reduce((acc, [division, seeds]) => {
      acc[division] = raceConfig[seeds.length]
      return acc
    }, {} as {
      [division in Division]: RoundConfig;
    })

    const nextRaces = divisions.reduce((acc, division) => {
      const divisionConf = config[division]
      acc[division] = divisionConf[nextStatus]?.reduce((accd, { template, name: groupName, seeds }) => {
        const lastStageDivisionRaces = round.races[status][division]

        const races: Race[] = template.races.map((race, i) => {
          const seed1 = seeds[race[0]]
          const team1 = lastStageDivisionRaces[seed1.group].results[seed1.position][0]
          const seed2 = seeds[race[1]]
          const team2 = lastStageDivisionRaces[seed2.group].results[seed2.position][0]
          return {
            stage: nextStatus,
            group: groupName,
            groupRace: i,
            teamMlIndices: race,
            team1,
            team2,
            division: division as Division,
          }
        })
        accd[groupName] = {
          races,
          teams: seeds.map(({ group, position }) => lastStageDivisionRaces[group].results[position][0]),
          complete: false,
          conflict: false,
        }
        return accd
      }, {} as StageRaces[Division])
      return acc
    }, {
      mixed: {},
      ladies: {},
      board: {},
    } as StageRaces)

    round.races[nextStatus] = nextRaces
    return nextStatus
  }

  function reopenRoundAtStage(round: Round, stage: RaceStage) {
    round.results = undefined
    switch (stage) {
      case "stage1":
      case "stage2":
        round.races.knockout = undefined
    }
    if (stage === "stage1") {
      round.races.stage2 = undefined
    }
    round.status = stage
  }

  function completeRound(round: Round): "complete" {
    const { status } = round
    // Prior stage races must be complete or not exist (e.g. all divisions < 7 teams)
    const races = round.races[status]

    const ready = Object.values(races)
      .every(divRaces => Object.values(divRaces)
        .every(groupRaces => groupRaces.complete && !groupRaces.conflict))
    if (!ready) {
      const err = `Races for ${status} are incomplete or results conflict - cannot progress`
      console.error(err, round.races)
      throw new Error(err)
    }

    const { teams } = round

    const config = Object.entries(teams).reduce((acc, [division, seeds]) => {
      acc[division] = raceConfig[seeds.length]
      return acc
    }, {} as {
      [division in Division]: RoundConfig;
    })

    const results = divisions.reduce((acc, division) => {
      const divisionConf = config[division].results
      divisionConf.forEach(({ stage, group, position, rank }) => {
        const divisionResults = acc[division]
        let rankResult: RoundResult = divisionResults.find(r => r.rank === rank)
        if (!rankResult) {
          rankResult = {
            rank,
            rankStr: asKnockoutId(rank),
            teams: [],
          }
        } else if (rankResult.teams.length < 2) {
          rankResult.rankStr = "Joint " + rankResult.rankStr
        }
        const team = round.races[stage]?.[division]?.[group]?.results?.[position]?.[0]
        if (!team) {
          console.error(`No team found for ${division} ${stage} ${group} ${position}`)
        }
        rankResult.teams.push(team)
        divisionResults.push(rankResult)
      })
      return acc
    }, {
      mixed: [],
      ladies: [],
      board: [],
    } as {
      [division in Division]: RoundResult[];
    })

    round.results = results
    return "complete"
  }

  return {
    saveLeagueConfig(league: League, config: LeagueData) {
      localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
    },
    getLeagueConfig(league: League): LeagueData | null {
      return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
    },
    createRound(league: League, teams: RoundSeeding, distributionOrder?: RoundSeeding): Round {
      const round = createRound(newStorageKeyRound(league), league, teams, distributionOrder)
      saveRound(round)
      return round
    },
    getRounds(league?: string): RoundInfo[] {
      const ids = JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
      // Wasteful but should be fine - can always convert to async for perf
      return ids
        .map(id => this.getRound(id) as Round)
        .filter(round => !!round)
        .filter(round => !league || round.league === league)
        .map(round => {
          return {
            ...round,
            date: new Date(round.date),
            races: undefined,
          }
        })
    },
    getRound(id: string): Round {
      const r = JSON.parse(localStorage.getItem(id))
      return {
        ...r,
        date: r.date ? new Date(r.date) : r,
      }
    },
    deleteRound(id: string) {
      localStorage.removeItem(id)
      const keyRoundIds = getStorageKeyRounds()
      const roundIds = JSON.parse(localStorage.getItem(keyRoundIds) ?? "[]") as string[]
      const updated = roundIds.filter(rid => rid !== id)
      localStorage.setItem(keyRoundIds, JSON.stringify(updated))
    },
    updateRace(id, race) {
      const { stage, division, group, groupRace } = race
      const round: Round = this.getRound(id)
      const stageRaces = round.races[stage]
      const groupData = stageRaces?.[division]?.[group]
      const groupRaces = groupData?.races
      if (!groupRaces || !groupRaces[groupRace]) {
        console.error(`No race exists for ${stage} ${division} ${group} ${groupRace}`, round.races)
        throw new Error(`No race exists for ${stage} ${division} ${group} ${groupRace}`)
      }
      groupRaces[groupRace] = race

      const complete = groupRaces.every(r => r.winner)
      groupData.complete = complete

      if (complete) {
        const results = calcTeamResults(groupData.teams, groupRaces)
        groupData.results = results.pos
        const conflict = results.pos.some(p => p.length > 1)
        groupData.conflict = conflict
      } else {
        groupData.results = undefined
        groupData.conflict = false
      }

      saveRound(round)
    },
    progressRound(id: string) {
      const round: Round = this.getRound(id)
      const { status } = round
      const nextStatus = (function(): "stage2" | "knockout" | "complete" {
        switch (status) {
          case "stage1":
            return progressRoundStage(round, status, "stage2")
          case "stage2":
            return progressRoundStage(round, status, "knockout")
          case "knockout":
            return completeRound(round)
          default:
            console.error(`Cannot progress round with status ${status}`)
            throw new Error(`Cannot progress round with status ${status}`)
        }
      })()

      round.status = nextStatus

      saveRound(round)
    },
    reopenStage(id: string, stage: RaceStage) {
      const round: Round = this.getRound(id)
      reopenRoundAtStage(round, stage)
      saveRound(round)
    }
  }
})()
