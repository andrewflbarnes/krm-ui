import { CheckCircle, CheckCircleOutline } from "@suid/icons-material";
import { Typography } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";

type MiniLeagueProps = {
  name: string;
  teams: string[];
  races: [number, number][];
  collapsed?: boolean;
  results: Array<{
    winner: 0 | 1 | 2;
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

export default function MiniLeague(props: MiniLeagueProps) {
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo<CollapseRaces>(() => {
    if (!props.collapsed) {
      return props.races.map((r, i) => ([{
        t1: props.teams[r[0] - 1],
        t1idx: r[0],
        t2: props.teams[r[1] - 1],
        t2idx: r[1],
        idx: i,
      }]))
    }

    const ret: CollapseRaces = []
    props.races.forEach((r, i) => {
      const t1idx = r[0]
      const t1 = props.teams[t1idx - 1]
      const t2idx = r[1]
      const t2 = props.teams[t2idx - 1]
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
  })
  return (
    <Typography>
      <table style={{ "border-spacing": "3px 0", "border-right": "1px solid #404040" }}>
        <caption style={{ "text-align": "left" }}>Group {props.name}</caption>
        <For each={props.teams}>{(team, teamIndex) => (
          <tr>
            <th style={{ "text-align": "left", position: "relative", height: "2em", width: "10em" }} scope="row">
              <div>
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
              return (
                <Switch>
                  <Match when={!!raceDetails}>
                    <td
                      onMouseEnter={() => setHighlight(raceDetails.idx)}
                      onMouseLeave={() => setHighlight(prev => prev == raceDetails.idx ? null : prev)}
                      style={{
                        cursor: "pointer",
                        "border-top": topBorder ? "2px solid #404040" : "",
                        "border-bottom": botBorder ? "2px solid #404040" : "",
                        "border-left": highlightRace(raceDetails.idx) ? "3px solid green" : "3px solid #404040",
                        "border-right": highlightRace(raceDetails.idx) ? "3px solid green" : "3px solid #404040",
                        position: "relative",
                        height: "2em",
                        width: "2em",
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
                    <td style={{ background: "dimgray" }} />
                  </Match>
                </Switch>
              )
            }}</For>
          </tr>
        )}</For>
      </table>
    </Typography>
  )
}
