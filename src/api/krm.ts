import { divisions, Division, League, LeagueData, Race, RoundConfig, RoundSeeding, Round, StageRaces, RoundResult, RaceStage, Stage, MiniLeagueTemplate, leagues } from "../kings"
import { asPosition, calcTeamResults, createRound, minileagueSeededRaces } from "../kings/round-utils";
import { auth, db, serde } from "../firebase";
import { setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

export type CustomConfig<T> = {
  configs: {
    id: string;
    owner: string;
    description?: string;
    config: T;
  }[];
}
export type CustomRoundConfigs = CustomConfig<RoundConfig>
export type CustomMiniLeagueTemplates = CustomConfig<MiniLeagueTemplate>

export type RoundInfo = Omit<Round, "races">
export type ProgressionStage = Exclude<Stage, "stage1">;
export type RoundDetails = {
  league: League;
  round: string;
  venue: string;
  description: string;
}
export type KrmApi = {
  clearLocalData():void;
  saveLeagueConfig(league: League, config: LeagueData): void;
  getLeagueConfig(league: League): LeagueData | null;
  createRound(details: RoundDetails, teams: RoundSeeding, raceConfigs: Record<number, RoundConfig>, distributionOrder?: RoundSeeding): Round;
  getRounds(league?: string): RoundInfo[];
  getRound(id: string): Round;
  deleteRound(id: string): void;
  updateRace(id: string, race: Race): void;
  progressRound(id: string): ProgressionStage;
  reopenStage(id: string, stage: RaceStage): void;
  uploadRound(id: string): Promise<void>;
  syncRounds(league: string): Promise<RoundInfo[]>;
  getCustomRoundConfigs(): Promise<CustomRoundConfigs>;
  getCustomMiniLeagueConfigs(): Promise<CustomMiniLeagueTemplates>;
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

  function getRound(id: string): Round {
    const r = JSON.parse(localStorage.getItem(id))
    const { details } = r
    return {
      ...r,
      details: {
        ...details,
        date: details.date ? new Date(details.date) : new Date(),
      }
    }
  }

  return {
    clearLocalData() {
      const ids = JSON.parse(localStorage.getItem(getStorageKeyRounds()) ?? "[]") as string[]
      ids.forEach(id => {
        localStorage.removeItem(id)
      })
      for (const league of leagues) {
        localStorage.removeItem(getStorageKeyLeagueConfig(league))
      }
      localStorage.removeItem(getStorageKeyRounds())
      localStorage.removeItem("kings-selected-league")
    },
    saveLeagueConfig(league: League, config: LeagueData) {
      localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
    },
    getLeagueConfig(league: League): LeagueData | null {
      return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
    },
    createRound(details: RoundDetails, teams: RoundSeeding, raceConfigs: Record<number, RoundConfig>, distributionOrder?: RoundSeeding): Round {
      const round = createRound(newStorageKeyRound(details.league), details, teams, raceConfigs, distributionOrder)
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
            date: new Date(round.details?.date),
            races: undefined,
          }
        })
    },
    getRound,
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

      saveRound(round)

      return nextStatus
    },
    reopenStage(id: string, stage: RaceStage) {
      const round: Round = this.getRound(id)
      const owner = auth?.currentUser?.uid
      if (owner !== round.owner && round.owner !== "local") {
        throw new Error("Cannot update rounds you do not own")
      }
      reopenRoundAtStage(round, stage)
      saveRound(round)
    },
    async uploadRound(id: string) {
      const owner = auth?.currentUser?.uid
      if (!owner) {
        throw new Error("User is not logged in and fully authenticated")
      }
      // TODO use built in support for converters in firestore
      const round = getRound(id)
      if (owner !== round.owner && round.owner !== "local") {
        throw new Error("Cannot update rounds you do not own")
      }
      const fsRound = serde.toFirestoreRound(round)
      const payload = {
        ...fsRound,
        owner,
      }

      const ref = doc(db, "rounds", id)
      await setDoc(ref, payload)
      if (owner !== round.owner) {
        round.owner = owner
        saveRound(round)
      }
    },
    async syncRounds(league: string) {
      const roundsRef = collection(db, "rounds")
      const q = query(roundsRef, where("league", "==", league))
      const rounds = await getDocs(q)
      // FIXME detect dups
      const dl = rounds.docs
        .map(doc => doc.data())
        .map(d => serde.fromFirestoreRound(d as unknown as Round))
      // todo detect conflicts
      dl.forEach(saveRound)
      // todo we need to ensure any in state rounds are refreshed
      return dl
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
