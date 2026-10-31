import { divisions, Division, League, RoundConfig, RoundSeeding, Round, StageRaces, RoundResult, RaceStage, RoundOptions } from "@/kings"
import { calcTeamResults, createRound, minileagueSeededRaces } from "@/kings";
import { asPosition } from "@/kings/core-utils";
import { KrmEngine, ProgressionStage, RoundDetails, RoundInfo } from "@/kings/engine/types";
import cacher from "@/kings/engine/cacher"

export type * from "@/kings/engine/types"

// This is a pseudo API which is really the kings "engine" backed by local
// storage

export default (function KrmEngine(): KrmEngine {
  function newRoundId(league: League) {
    return `${league}-${new Date().getTime()}`
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

    const { config } = round

    const nextRaces = divisions.reduce((acc, division) => {
      const divisionConf = config[division]
      acc[division] = divisionConf[nextStatus]?.reduce((accd, { template, name: groupName, seeds }) => {
        const lastStageDivisionRaces = round.races[status][division]

        const races = minileagueSeededRaces(template, seeds, lastStageDivisionRaces, groupName, nextStatus, division)
        accd[groupName] = {
          races,
          teams: seeds.map(({ group, position }) => lastStageDivisionRaces[group].results[position][0]),
          complete: !races.length,
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

    const { config } = round

    const results = divisions.reduce((acc, division) => {
      const divisionConf = config[division].results
      divisionConf.forEach(({ stage, group, position, rank }) => {
        const divisionResults = acc[division]
        let rankResult: RoundResult = divisionResults.find(r => r.rank === rank)
        if (!rankResult) {
          rankResult = {
            rank,
            rankStr: asPosition(rank),
            teams: [],
          }
        } else if (rankResult.teams.length < 2) {
          rankResult.rankStr = "= " + rankResult.rankStr
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
    clearLocalData: cacher.clearData,
    saveLeagueConfig: cacher.saveLeagueConfig,
    getLeagueConfig: cacher.getLeagueConfig,
    saveRound: cacher.saveRound,
    createRound(details: RoundDetails, options: RoundOptions, teams: RoundSeeding, raceConfigs: Record<number, RoundConfig>, distributionOrder?: RoundSeeding): Round {
      const roundId = newRoundId(details.league)
      const round = createRound(roundId, details, options, teams, raceConfigs, distributionOrder)
      this.saveRound(round)
      return round
    },
    getRounds(league?: string): RoundInfo[] {
      const ids = cacher.getRoundsIds()
      // Wasteful but should be fine - can always convert to async for perf
      return ids
        .map(id => this.getRound(id) as Round)
        .filter(round => !!round)
        .filter(round => !league || round.league === league)
        .map(round => {
          return {
            ...round,
            date: new Date(round.details?.date),
            races: undefined,
          }
        })
    },
    getRound: cacher.getRound,
    deleteRound: cacher.deleteRound,
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
        const calcOptions = {
          resolveConflicts: {
            method: round.options.conflictResolution ?? "manual",
            seeds: round.teams[race.division]
          }
        }
        const results = calcTeamResults(groupData.teams, groupRaces, calcOptions)
        groupData.results = results.pos
        const conflict = results.pos.some(p => p.length > 1)
        groupData.conflict = conflict
      } else {
        groupData.results = undefined
        groupData.conflict = false
      }

      this.saveRound(round)
    },
    progressRound(id: string): ProgressionStage {
      const round: Round = this.getRound(id)
      const { status } = round
      const nextStatus = (function(): ProgressionStage {
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

      this.saveRound(round)

      return nextStatus
    },
    reopenStage(id: string, stage: RaceStage, user: string) {
      const round: Round = this.getRound(id)
      if (user !== round.owner && round.owner !== "local") {
        throw new Error("Cannot update rounds you do not own")
      }
      reopenRoundAtStage(round, stage)
      this.saveRound(round)
    },
    async getCustomRoundConfigs() {
      // FIXME
      return new Promise((res) => res({ configs: [] }))
    },
    async getCustomMiniLeagueConfigs() {
      // FIXME
      return new Promise((res) => res({ configs: [] }))
    },
  }
})()
