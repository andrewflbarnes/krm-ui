import { CheckCircle, CheckCircleOutline } from "@suid/icons-material";
import { Menu, MenuItem, Typography } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";
import { Race } from "../kings";
import { calcTeamResults, collapseRaces } from "../kings/utils";

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
  onResultChange: (race: Race) => void;
}

export default function MiniLeague(props: MiniLeagueProps) {
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo(() => collapseRaces(props.races, props.collapsed))

  const highlightTeams = createMemo(() => {
    if (highlight() == null) {
      return []
    }
    const race = props.races[highlight()]
    return [props.teams[race[0] - 1], props.teams[race[1] - 1]]
  })


  const teamPositions = createMemo(() => calcTeamResults(props.teams, props.races))

  const [anchorEl, setAnchorEl] = createSignal<HTMLTableColElement | null>(null)
  const [ctxRace, setCtxRace] = createSignal<[Race, string]>()
  const handleContext = (ctx: [Race, string], e: MouseEvent) => {
    e.preventDefault()
    setAnchorEl(e.currentTarget as HTMLTableColElement)
    setCtxRace(ctx)
  }

  // TODO split up the below into separate components maybe
  return (
    <>
      <Menu
        //id="league-selector-menu"
        anchorEl={anchorEl()}
        open={!!anchorEl()}
        onClose={() => setAnchorEl(null)}
      //MenuListProps={{ "aria-labelledby": "league-selector-button" }}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null)
          const [r, t] = ctxRace()
          const f: keyof Pick<Race, "team1Dsq" | "team2Dsq"> = r.team1 == t
            ? "team1Dsq"
            : "team2Dsq"
          props.onResultChange({
            ...r,
            [f]: !r[f]
          })
        }}>dsq</MenuItem>
      </Menu>
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
          <For each={props.teams}>{(team) => {
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
                  const dsq = raceDetails && (ti == 1 ? raceDetails.team1Dsq : raceDetails.team2Dsq)
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
                          onContextMenu={[handleContext, [raceDetails, team]]}
                          onClick={() => props.onResultChange({ ...raceDetails, winner: ti })}
                        >
                          <div style={{
                            display: "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            "justify-content": "center",
                          }}>
                            <Show when={raceDetails.winner === ti} fallback={<CheckCircleOutline color={dsq ? "error" : "inherit"} />}>
                              <CheckCircle color={dsq ? "error" : "success"} />
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
    </>
  )
}
