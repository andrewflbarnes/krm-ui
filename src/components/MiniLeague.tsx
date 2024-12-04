import { CheckCircle, CheckCircleOutline } from "@suid/icons-material";
import { Typography } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";
import { Race } from "../kings";

// TODO use theme colors
const borderColour = "dimgray"
const highlightColour = "lightgreen"
const borderStyle = "2px solid"
const checkSize = "2em"
// The below can be used to control dimming all races except the hovered one,
// though it can be a little janky
const dimOpacity = 1  // opacity to dim to
const dimDelay = "0s" // delay before dimming starts
const dimIn = "0s"    // transition time for dimming

type MiniLeagueProps = {
  name: string;
  teams: string[];
  races: Race[];
  collapsed?: boolean;
  onResultChange: (result: {
    raceIndex: number;
    winner: undefined | string;
    winnerIdx: undefined | number;
    winnerOrd: undefined | 1 | 2;
  }) => void;
}

// NOTE: t1idx and t2idx are 1-indexed since this is human understandable when
// configuring minileagues e.g. team 1 vs team 2 rather than team 0 vs team 1
type CollapseRaces = Race[][]

function collapseRaces(races: Race[], collapsed: boolean) {
  if (!collapsed) {
    return races.map(r => [r])
  }

  const ret: CollapseRaces = []
  races.forEach((race) => {
    const addNew = ret.length == 0
    if (addNew) {
      ret[0] = []
    }

    const last = ret[ret.length - 1]
    const currTeams = [race.team1, race.team2]
    const conflict = last.some(l => [l.team1, l.team2].some(t => currTeams.includes(t)))

    if (conflict) {
      ret.push([race])
    } else {
      last.push(race)
    }
  })
  return ret
}

type TeamResults = {
  pos: string[][];
  wins: {
    [team: string]: number;
  }
}

// note teams is a subset of those in races and results are only calculated
// based on races where both teams are in the subset
function calcTeamResults(teams: string[], allRaces: Race[]): TeamResults {
  const tws: {
    [team: string]: number;
  } = {}
  const races = allRaces.filter(({ team1, team2 }) => teams.includes(team1) && teams.includes(team2))
  teams.forEach((team) => {
    const wins = races.filter(({ team1, team2, winner }) =>
      (team1 == team && winner == 1) ||
      (team2 == team && winner == 2))
      .length
    tws[team] = wins
  })
  const check = Object.entries(tws).map(([team, wins]) => ({
    team,
    wins,
  }))
  check.sort((a, b) => b.wins - a.wins)

  const pos: string[][] = []
  let lastWins = 999
  check.forEach(teamPos => {
    if (teamPos.wins < lastWins) {
      pos.push([])
      lastWins = teamPos.wins
    }
    pos[pos.length - 1].push(teamPos.team)
  })
  const wins = check.reduce((acc, { team, wins }) => {
    acc[team] = wins
    return acc
  }, {})

  return {
    pos,
    wins,
  }
}

export default function MiniLeague(props: MiniLeagueProps) {
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo<CollapseRaces>(() => collapseRaces(props.races, props.collapsed))

  const highlightTeams = createMemo(() => {
    if (highlight() == null) {
      return []
    }
    const race = props.races[highlight()]
    return [props.teams[race[0] - 1], props.teams[race[1] - 1]]
  })


  const teamPositions = createMemo<TeamResults>(() => {
    // prepos is the positions when looking at wins across the whole minileague
    // In this case we ay have drawn teams whenever two or more teams share the
    // same number of wins
    const prepos = calcTeamResults(props.teams, props.races)
    // pos are the positions when looking at wins within drawn teams - i.e.
    // taking into account only races between the other drawn teams we can,
    // usually, work out the relative positions
    const pos: string[][] = []
    prepos.pos.forEach((drawnTeams) => {
      if (drawnTeams.length == 1) {
        pos.push(drawnTeams)
        return
      }
      const drawnResults = calcTeamResults(drawnTeams, props.races)
      Array.prototype.push.apply(pos, drawnResults.pos)
    })
    return {
      pos,
      wins: prepos.wins,
    }
  })

  return (
    <Typography>
      <table style={{ "border-spacing": "3px 0" }}>
        <thead>
          <tr>
            <td>Group {props.name}</td>
            <td colspan={collapsedRaces().length}>
              <Show when={props.races.every(({ winner }) => !!winner)}>
                <Typography variant="caption" color="success.main">Complete</Typography>
              </Show>
            </td>
          </tr>
        </thead>
        <For each={props.teams}>{(team, teamIndex) => {
          const wins = () => teamPositions().wins[team]
          const pos = () => teamPositions().pos.findIndex(p => p.includes(team))
          const posStr = () => {
            const p = pos()
            if (teamPositions().pos[p].length == props.teams.length) {
              if (!props.races.some(r => r.winner)) {
                return ""
              }
            }
            const joint = teamPositions().pos[p].length > 1 ? "joint " : ""
            switch (p) {
              case 0:
                return `${joint} 1st 🥇`
              case 1:
                return `${joint} 2nd 🥈`
              case 2:
                return `${joint} 3rd 🥉`
              default:
                return `${joint}${p + 1}th`
            }
          }
          return (
            <tr>
              <th style={{ "text-align": "left", position: "relative", height: "2em", width: "10em" }} scope="row">
                <div
                  style={{
                    opacity: highlightTeams().length === 0 || highlightTeams().includes(team) ? 1 : dimOpacity,
                    transition: highlightTeams().length === 0 || highlightTeams().includes(team) ? "0s" : dimIn,
                    "transition-delay": highlightTeams().length === 0 || highlightTeams().includes(team) ? "0s" : dimDelay,
                  }}
                >
                  {team}
                </div>
              </th>
              <For each={collapsedRaces()}>{(races) => {
                const raceDetails = races.find(r => r.team1 == team || r.team2 == team)
                let topBorder = false
                let botBorder = false
                if (raceDetails) {
                  const { team1, team2, teamMlIndices: [t1idx, t2idx] } = raceDetails
                  const needsBorder = !!raceDetails && Math.abs(t1idx - t2idx) > 1
                  if (needsBorder) {
                    botBorder = true
                    topBorder = true
                  } else {

                    if ((team1 == team && t1idx > t2idx) || (team2 == team && t2idx > t1idx)) {
                      botBorder = true
                    } else {
                      topBorder = true
                    }
                  }
                }
                const ti = raceDetails?.team1 == team ? 1 : 2
                const dim = () => highlight() != null && !highlightRace(raceDetails?.groupRace)
                return (
                  <Switch>
                    <Match when={!!raceDetails}>
                      <td
                        onMouseEnter={() => setHighlight(raceDetails.groupRace)}
                        onMouseLeave={() => setHighlight(prev => prev == raceDetails.groupRace ? null : prev)}
                        style={{
                          cursor: "pointer",
                          "border-top": topBorder ? `${borderStyle} ${borderColour}` : "",
                          "border-bottom": botBorder ? `${borderStyle} ${borderColour}` : "",
                          "border-left": highlightRace(raceDetails.groupRace) ? `${borderStyle} ${highlightColour}` : `${borderStyle} ${borderColour}`,
                          "border-right": highlightRace(raceDetails.groupRace) ? `${borderStyle} ${highlightColour}` : `${borderStyle} ${borderColour}`,
                          position: "relative",
                          height: checkSize,
                          width: checkSize,
                          opacity: dim() ? dimOpacity : 1,
                          transition: `opacity ${dim() ? dimIn : "0s"}`,
                          "transition-delay": dim() ? dimDelay : "0s",
                        }}
                        onClick={() => props.onResultChange({
                          raceIndex: raceDetails.groupRace,
                          winner: team,
                          winnerIdx: teamIndex(),
                          winnerOrd: ti,
                        })}
                      >
                        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "center" }}>
                          <Show when={raceDetails.winner === ti} fallback={<CheckCircleOutline />}>
                            <CheckCircle color="success" />
                          </Show>
                        </div>
                      </td>
                    </Match>
                    <Match when={!raceDetails}>
                      <td style={{ background: borderColour }} />
                    </Match>
                  </Switch>
                )
              }}</For>
              <td
                style={{
                  height: checkSize,
                  width: checkSize,
                }}
              >
                <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "center" }}>
                  {wins()}
                </div>
              </td>
              <td>
                {posStr()}
              </td>
            </tr>
          )
        }}</For>
      </table>
    </Typography>
  )
}
