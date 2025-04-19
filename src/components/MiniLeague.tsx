import { Menu, MenuItem, Typography } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";
import { Race } from "../kings";
import { calcTeamResults, collapseRaces } from "../kings/utils";
import RaceResultIcon from "../ui/RaceResultIcon";
import Selector from "../ui/Selector";

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
  name?: string;
  teams: string[];
  races: Race[];
  collapsed?: boolean;
  live?: boolean;
  noResults?: boolean;
  onResultChange?: (race: Race) => void;
  readonly?: boolean;
  // Selectable allows a user to modify the team/seed in each position, in this
  // cacse the teams props is a superset of the actual teams in this minileague
  // and the races are expected to be synthetic
  selectable?: string[];
  initialSelected?: string[];
  onTeamSelected?: (team: string, i: number) => void;
}

export default function MiniLeague(props: MiniLeagueProps) {
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo(() => collapseRaces(props.races, props.collapsed))
  const teams = createMemo(() => props.selectable
    ? [...new Set(props.races.flatMap(({ team1, team2 }) => [team1, team2]))]
    : props.teams)
  const teamOptions = createMemo(() => props.teams.map(t => ({ value: t, label: t })))

  const highlightTeams = createMemo(() => {
    if (highlight() == null) {
      return []
    }
    const race = props.races[highlight()]
    return [teams()[race[0]], teams()[race[1]]]
  })


  const teamPositions = createMemo(() => calcTeamResults(teams(), props.races))

  const [anchorEl, setAnchorEl] = createSignal<HTMLTableColElement | null>(null)
  const [ctxRace, setCtxRace] = createSignal<{ race: Race, team: string }>()
  const handleContext = (ctx: { race: Race, team: string }, e: MouseEvent) => {
    e.preventDefault()
    setAnchorEl(e.currentTarget as HTMLTableColElement)
    setCtxRace(ctx)
  }
  const finished = () => props.races.every(({ winner }) => !!winner)

  return (
    <>
      <ContextMenu
        anchor={anchorEl()}
        onClose={() => setAnchorEl(null)}
        race={ctxRace()?.race}
        team={ctxRace()?.team}
        onResultChange={props.onResultChange}
      />
      <table style={{ "border-spacing": "3px 0" }}>
        <Show when={!props.noResults || props.name}>
          <thead>
            <tr>
              <td colspan={collapsedRaces().length + 2}>
                <Typography variant="h4">
                  {props.name}
                </Typography>
              </td>
              <Show when={!props.noResults}>
                <td colspan={1}>
                  <Show when={props.races.every(({ winner }) => !!winner)}>
                    <Typography variant="caption" color="success.main">Complete</Typography>
                  </Show>
                </td>
              </Show>
            </tr>
          </thead>
        </Show>
        <For each={teams()}>{(team, i) => {
          return (
            <tr>
              <th style={{ "text-align": "left", position: "relative", height: "2em", "white-space": "nowrap" }} scope="row">
                <div
                  style={{
                    opacity: highlightTeams().length === 0 || highlightTeams().includes(team) ? 1 : dimOpacity,
                    transition: highlightTeams().length === 0 || highlightTeams().includes(team) ? "0s" : dimIn,
                    "transition-delay": highlightTeams().length === 0 || highlightTeams().includes(team) ? "0s" : dimDelay,
                    "padding-right": "1em",
                  }}
                >
                  <Show when={props.selectable} fallback={team}>{(selectable) => {
                    const [selected, setSelected] = createSignal(props.initialSelected?.[i()] ?? "")
                    const handleTeamSelected = (v: string, i: number) => {
                      setSelected(v)
                      props.onTeamSelected(v, i)
                    }
                    const theseOptions = () => {
                      const s = selected()
                      const opts = teamOptions().filter(o => selectable().includes(o.value))
                      opts.unshift({ value: "", label: "-" })
                      if (s.length) {
                        opts.unshift({ value: s, label: s })
                      }
                      return opts
                    }
                    return (
                      <Selector
                        current={selected()}
                        options={theseOptions()}
                        containerProps={{
                          style: { "min-width": "10em" },
                        }}
                        small
                        onClose={(v) => handleTeamSelected(v, i())}
                      />
                    )
                  }}</Show>
                </div>
              </th>
              <For each={collapsedRaces()}>{(races) => {
                const raceDetails = races.find(r => r.team1 == team || r.team2 == team)
                return (
                  <Switch>
                    <Match when={!!raceDetails}>{(_) => {
                      let topBorder = false
                      let botBorder = false
                      const { team1, team2 } = raceDetails
                      const t1idx = teams().indexOf(team1)
                      const t2idx = teams().indexOf(team2)
                      if (raceDetails) {
                        const needsBorder = Math.abs(t1idx - t2idx) > 1
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
                      const ti = team1 == team ? 1 : 2
                      const dsq = ti == 1 ? raceDetails.team1Dsq : raceDetails.team2Dsq
                      const dim = () => highlight() != null && !highlightRace(raceDetails?.groupRace)
                      const teamOrdinal = (ti == 1 && t1idx < t2idx) || (ti == 2 && t2idx < t1idx) ? 1 : 2
                      return (
                        <td
                          data-testid={`race-${raceDetails.group}-${raceDetails.groupRace}-${teamOrdinal}`}
                          onMouseEnter={() => setHighlight(raceDetails.groupRace)}
                          onMouseLeave={() => setHighlight(prev => prev == raceDetails.groupRace ? null : prev)}
                          style={{
                            cursor: props.readonly ? "inherit" : "pointer",
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
                          onContextMenu={props.readonly ? null : [handleContext, { race: raceDetails, team }]}
                          onClick={() => !props.readonly && !raceDetails.winner && props.onResultChange({ ...raceDetails, winner: ti })}
                        >
                          <div style={{
                            display: "flex",
                            "flex-direction": "row",
                            "align-items": "center",
                            "justify-content": "center",
                          }}>
                            <RaceResultIcon
                              won={raceDetails.winner == ti}
                              dsq={dsq}
                              conceded={raceDetails.winner != ti && raceDetails.indicators == "by"}
                            />
                          </div>
                        </td>
                      )
                    }}</Match>
                    <Match when={!raceDetails}>
                      <td style={{ background: borderColour }} />
                    </Match>
                  </Switch>
                )
              }}</For>
              <Show when={!props.noResults}>{(_) => {
                const wins = () => teamPositions().data[team]?.wins
                const pos = () => teamPositions().pos.findIndex(p => p.includes(team))
                const posInfo = () => {
                  const p = pos()
                  if (teamPositions().pos[p].length == teams().length) {
                    if (!props.races.some(r => r.winner)) {
                      return ""
                    }
                  }
                  const joint = teamPositions().pos[p].length > 1 ? "joint " : ""
                  switch (p) {
                    case 0:
                      return [`${joint}1st`, "🥇"]
                    case 1:
                      return [`${joint}2nd`, "🥈"]
                    case 2:
                      return [`${joint}3rd`, "🥉"]
                    default:
                      return [`${joint}${p + 1}th`, ""]
                  }
                }
                return (
                  <>
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
                    <td style={{ width: "3em" }}>
                      <div style={{ "white-space": "nowrap", display: "flex", "justify-content": "space-between", "align-items": "center" }}>
                        <Show when={finished() || props.live}>
                          <div>
                            {posInfo()[0]}
                          </div>
                          <div>
                            {posInfo()[1]}
                          </div>
                        </Show>
                      </div>
                    </td>
                  </>
                )
              }}</Show>
            </tr>
          )
        }}</For>
      </table>
    </>
  )
}

function ContextMenu(props: {
  anchor: HTMLTableColElement;
  race: Race;
  team: string;
  onClose: () => void;
  onResultChange: (r: Race) => void;
}) {
  return (
    <Show when={props.race}>{(race) => {
      const dsqField = createMemo<keyof Pick<Race, "team1Dsq" | "team2Dsq">>(() => race().team1 == props.team
        ? "team1Dsq"
        : "team2Dsq")
      return (
        <Menu
          container={props.anchor}
          //id="league-selector-menu"
          anchorEl={props.anchor}
          open={!!props.anchor}
          onClose={(e) => {
            e.stopPropagation?.()
            props.onClose()
          }}
        //MenuListProps={{ "aria-labelledby": "league-selector-button" }}
        >
          <MenuItem onClick={(e) => {
            e.stopPropagation()
            props.onClose()
            const update: Race = {
              ...race(),
            }
            update.winner = update.team1 == props.team ? 1 : 2
            props.onResultChange(update)
          }}>winner</MenuItem>
          <Show when={race().indicators != "by"}>
            <MenuItem onClick={(e) => {
              e.stopPropagation()
              props.onClose()
              const update = {
                ...race(),
              }
              update[dsqField()] = !update[dsqField()]
              props.onResultChange(update)
            }}>{race()[dsqField()] && "clear "}dsq</MenuItem>
          </Show>
          <Show when={!race().team1Dsq && !race().team2Dsq}>
            <MenuItem onClick={(e) => {
              e.stopPropagation()
              props.onClose()
              const update: Race = {
                ...race(),
                team1Dsq: false,
                team2Dsq: false,
              }
              if (update.indicators == "by") {
                update.indicators = undefined
              } else {
                update.winner = update.team1 == props.team ? 2 : 1
                update.indicators = "by"
              }
              props.onResultChange(update)
            }}>{race().indicators == "by" ? "clear by" : "concede (by)"}</MenuItem>
          </Show>
          <MenuItem onClick={(e) => {
            e.stopPropagation()
            props.onClose()
            const update: Race = {
              ...race(),
              team1Dsq: false,
              team2Dsq: false,
              winner: undefined,
              indicators: undefined,
            }
            props.onResultChange(update)
          }}>reset</MenuItem>
        </Menu>
      )
    }}</Show>
  )
}
