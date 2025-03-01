import { divisions, Division, League, LeagueData, Race, raceConfig, RoundConfig, RoundSeeding, Round, StageRaces, RoundResult, asKnockoutId } from "../kings"
import { calcTeamResults } from "../kings/round-utils";
import { auth, db, serde } from "../firebase";
import { setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

export type RoundInfo = Omit<Round, "races">

// TODO transition to async so we can support indexedDB and an eventual API
// TODO transition to tanstack query
export type KrmApi = {
  saveLeagueConfig(league: League, config: LeagueData): void;
  getLeagueConfig(league: League): LeagueData | null;
  createRound(league: League, teams: RoundSeeding): Round;
  getRounds(league?: string): RoundInfo[];
  getRound(id: string): Round;
  deleteRound(id: string): void;
  updateRace(id: string, race: Race): void;
  progressRound(id: string): void;
  uploadRound(id: string): Promise<void>;
  syncRounds(league: string): Promise<RoundInfo[]>;
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
    // TODO knockouts may only rely on stage 1
    const races: StageRaces = round.races[status]
    if (!races) {
      const err = `No races exist for stage ${status} - cannot progress`
      console.error(err, round.races)
      throw new Error(err)
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
        // both race indexes and seeds are 1-indexed
        const lastStageDivisionRaces = round.races[status][division]

        const races: Race[] = template.races.map((race, i) => {
          const seed1 = seeds[race[0] - 1]
          const team1 = lastStageDivisionRaces[seed1.group].results[seed1.position - 1][0]
          const seed2 = seeds[race[1] - 1]
          const team2 = lastStageDivisionRaces[seed2.group].results[seed2.position - 1][0]
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
          teams: teams[division].filter(t => races.some(r => r.team1 === t || r.team2 === t)),
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
  }

  function completeRound(round: Round) {
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
        const team = round.races[stage]?.[division]?.[group]?.results?.[position - 1]?.[0]
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
  }

  function getRound(id: string): Round {
    const r = JSON.parse(localStorage.getItem(id))
    return {
      ...r,
      date: r.date ? new Date(r.date) : r,
    }
  }

  return {
    saveLeagueConfig(league: League, config: LeagueData) {
      localStorage.setItem(getStorageKeyLeagueConfig(league), JSON.stringify(config))
    },
    getLeagueConfig(league: League): LeagueData | null {
      return JSON.parse(localStorage.getItem(getStorageKeyLeagueConfig(league)))
    },
    createRound(league: League, teams: RoundSeeding): Round {
      const config = Object.entries(teams).reduce((acc, [division, seeds]) => {
        acc[division] = raceConfig[seeds.length]
        return acc
      }, {} as {
        [division in Division]: RoundConfig;
      })

      const races = divisions.reduce((acc, division) => {
        const divisionConf = config[division]
        acc[division] = divisionConf.stage1.reduce((accd, { template, name: groupName, seeds }) => {
          const races: Race[] = template.races.map((race, i) => ({
            stage: "stage1",
            group: groupName,
            groupRace: i,
            // both race indexes and seeds are 1-indexed
            teamMlIndices: race,
            team1: teams[division][seeds[race[0] - 1].position - 1],
            team2: teams[division][seeds[race[1] - 1].position - 1],
            division: division as Division,
          }))
          accd[groupName] = {
            races,
            teams: teams[division].filter(t => races.some(r => r.team1 === t || r.team2 === t)),
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
      // TODO details
      const round: Round = {
        id: newStorageKeyRound(league),
        owner: "local",
        league,
        date: new Date(),
        description: "Round 2",
        venue: "Gloucester",
        status: "stage1",
        config,
        races: {
          stage1: races,
        },
        teams,
      }
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
        // FIXME the below doesn't result in any feedback to the user on the UI
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
            // TODO if config has no stage 2 races go straight to knockouts
            progressRoundStage(round, status, "stage2")
            return "stage2"
          case "stage2":
            progressRoundStage(round, status, "knockout")
            return "knockout"
          case "knockout":
            completeRound(round)
            return "complete"
          default:
            console.error(`Cannot progress round with status ${status}`)
            throw new Error(`Cannot progress round with status ${status}`)
        }
      })()

      round.status = nextStatus

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
    }
  }
})()
