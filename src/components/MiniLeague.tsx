import { CheckCircle, CheckCircleOutline } from "@suid/icons-material";
import { Typography } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";

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
  races: [number, number][];
  collapsed?: boolean;
  results: Array<{
    winner?: 1 | 2;
    t1Dsq?: string;
    t2Dsq?: string;
  } | undefined>;
  onResultChange: (result: {
    raceIndex: number;
    winner: undefined | string;
    winnerIdx: undefined | number;
    winnerOrd: undefined | 1 | 2;
  }) => void;
}

// NOTE: t1idx and t2idx are 1-indexed since this is human understandable when
// configuring minileagues e.g. team 1 vs team 2 rather than team 0 vs team 1
type CollapseRaces = {
  t1: string;
  t1idx: number;
  t2: string;
  t2idx: number;
  idx: number;
}[][]

function collapseRaces(races: [number, number][], teams: string[], collapsed: boolean) {
  if (!collapsed) {
    return races.map((r, i) => ([{
      t1: teams[r[0] - 1],
      t1idx: r[0],
      t2: teams[r[1] - 1],
      t2idx: r[1],
      idx: i,
    }]))
  }

  const ret: CollapseRaces = []
  races.forEach((r, i) => {
    const t1idx = r[0]
    const t1 = teams[t1idx - 1]
    const t2idx = r[1]
    const t2 = teams[t2idx - 1]
    const raceDetail = {
      t1, t1idx, t2, t2idx, idx: i,
    }

    const addNew = ret.length == 0
    if (addNew) {
      ret[0] = []
    }

    const last = ret[ret.length - 1]
    const conflict = last.some(l => l.t1 == t1 || l.t1 == t2 || l.t2 == t1 || l.t2 == t2)

    if (conflict) {
      ret.push([raceDetail])
    } else {
      last.push(raceDetail)
    }
  })
  return ret
}

export default function MiniLeague(props: MiniLeagueProps) {
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo<CollapseRaces>(() => collapseRaces(props.races, props.teams, props.collapsed))

  const highlightTeams = createMemo(() => {
    if (highlight() == null) {
      return []
    }
    const race = props.races[highlight()]
    return [props.teams[race[0] - 1], props.teams[race[1] - 1]]
  })

  return (
    <Typography>
      <table style={{ "border-spacing": "3px 0" }}>
        <caption style={{ "text-align": "left" }}>Group {props.name}</caption>
        <For each={props.teams}>{(team, teamIndex) => {
          console.log(props.teams, props.races, props.results)
          const wins = () => props.races.filter(([t1, t2], ri) =>
            (t1 == teamIndex() + 1 && props.results[ri].winner == 1) ||
            (t2 == teamIndex() + 1 && props.results[ri].winner == 2))
            .length
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
                const raceDetails = races.find(r => r.t1 == team || r.t2 == team)
                let topBorder = false
                let botBorder = false
                if (raceDetails) {
                  const { t1, t2, t1idx, t2idx } = raceDetails
                  const needsBorder = !!raceDetails && Math.abs(t1idx - t2idx) > 1
                  if (needsBorder) {
                    botBorder = true
                    topBorder = true
                  } else {

                    if ((t1 == team && t1idx > t2idx) || (t2 == team && t2idx > t1idx)) {
                      botBorder = true
                    } else {
                      topBorder = true
                    }
                  }
                }
                const ti = raceDetails?.t1 == team ? 1 : 2
                const dim = () => highlight() != null && !highlightRace(raceDetails?.idx)
                return (
                  <Switch>
                    <Match when={!!raceDetails}>
                      <td
                        onMouseEnter={() => setHighlight(raceDetails.idx)}
                        onMouseLeave={() => setHighlight(prev => prev == raceDetails.idx ? null : prev)}
                        style={{
                          cursor: "pointer",
                          "border-top": topBorder ? `${borderStyle} ${borderColour}` : "",
                          "border-bottom": botBorder ? `${borderStyle} ${borderColour}` : "",
                          "border-left": highlightRace(raceDetails.idx) ? `${borderStyle} ${highlightColour}` : `${borderStyle} ${borderColour}`,
                          "border-right": highlightRace(raceDetails.idx) ? `${borderStyle} ${highlightColour}` : `${borderStyle} ${borderColour}`,
                          position: "relative",
                          height: checkSize,
                          width: checkSize,
                          opacity: dim() ? dimOpacity : 1,
                          transition: `opacity ${dim() ? dimIn : "0s"}`,
                          "transition-delay": dim() ? dimDelay : "0s",
                        }}
                        onClick={() => props.onResultChange({
                          raceIndex: raceDetails.idx,
                          winner: team,
                          winnerIdx: teamIndex(),
                          winnerOrd: ti,
                        })}
                      >
                        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "center" }}>
                          <Show when={props.results[raceDetails.idx]?.winner === ti} fallback={<CheckCircleOutline />}>
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
                  {wins}
                </div>
              </td>
            </tr>
          )
        }}</For>
      </table>
    </Typography>
  )
}
