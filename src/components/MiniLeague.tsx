import { Box, Chip, Menu, MenuItem, Typography, useTheme } from "@suid/material";
import { createMemo, createSelector, createSignal, For, Match, Show, Switch } from "solid-js";
import { Race } from "../kings";
import { calcTeamResults, collapseRaces } from "../kings/utils";
import RaceResultIcon from "../ui/RaceResultIcon";
import { RANK_GRADIENT } from "../ui/RankBadge";
import Selector from "../ui/Selector";

const CELL_SIZE = "2em";
const BORDER = "2px solid";

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
  // case the teams prop is a superset of the actual teams in this minileague
  // and the races are expected to be synthetic
  selectable?: string[];
  initialSelected?: string[];
  onTeamSelected?: (team: string, i: number) => void;
}

export default function MiniLeague(props: MiniLeagueProps) {
  const theme = useTheme()
  const borderColour = () => theme.palette.divider
  const highlightColour = () => theme.palette.primary.main
  const [highlight, setHighlight] = createSignal<number | null>(null);
  const highlightRace = createSelector(highlight)
  const collapsedRaces = createMemo(() => collapseRaces(props.races, props.collapsed))
  const teams = createMemo(() => props.selectable
    ? [...new Set(props.races.flatMap(({ team1, team2 }) => [team1, team2]))]
    : props.teams)
  const teamOptions = createMemo(() => props.teams.map(t => ({ value: t, label: t })))

  const highlightTeams = createMemo(() => {
    if (highlight() == null) return []
    const race = props.races[highlight()]
    return [race.team1, race.team2]
  })

  const teamPositions = createMemo(() => calcTeamResults(teams(), props.races))

  const [anchorEl, setAnchorEl] = createSignal<HTMLTableColElement | null>(null)
  const [ctxRace, setCtxRace] = createSignal<{ race: Race, team: string }>()
  const handleContext = (ctx: { race: Race, team: string }, e: MouseEvent) => {
    e.preventDefault()
    setAnchorEl(e.currentTarget as HTMLTableColElement)
    setCtxRace(ctx)
  }
  const finished = createMemo(() => props.races.every(({ winner }) => !!winner))

  return (
    <>
      <ContextMenu
        anchor={anchorEl()}
        onClose={() => setAnchorEl(null)}
        race={ctxRace()?.race}
        team={ctxRace()?.team}
        onResultChange={props.onResultChange}
      />
      <table style={{ "border-spacing": "4px 0" }}>
        <Show when={!props.noResults || props.name}>
          <thead>
            <tr>
              <td colspan={collapsedRaces().length + 2}>
                <Show when={props.name}>
                  <Typography
                    variant="overline"
                    sx={{
                      fontWeight: 800,
                      fontSize: "0.65rem",
                      letterSpacing: "0.12em",
                      color: "text.secondary",
                      lineHeight: 1,
                    }}
                  >
                    {props.name}
                  </Typography>
                </Show>
              </td>
              <Show when={!props.noResults}>
                <td>
                  <Show when={finished()}>
                    <Chip
                      label="Complete"
                      size="small"
                      color="success"
                      sx={{
                        height: 18,
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        "& .MuiChip-label": { px: 1 },
                      }}
                    />
                  </Show>
                </td>
              </Show>
            </tr>
          </thead>
        </Show>
        <For each={teams()}>{(team, i) => {
          const dimmed = createMemo(() => { const ht = highlightTeams(); return ht.length > 0 && !ht.includes(team) })
          return (
            <tr>
              <th
                style={{
                  "text-align": "left",
                  position: "relative",
                  height: CELL_SIZE,
                  "white-space": "nowrap",
                  "padding-right": "12px",
                  opacity: dimmed() ? 0.3 : 1,
                  transition: "opacity 0.15s ease",
                }}
                scope="row"
              >
                <Show when={props.selectable} fallback={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    {team}
                  </Typography>
                }>{(selectable) => {
                  const [selected, setSelected] = createSignal(props.initialSelected?.[i()] ?? "")
                  const handleTeamSelected = (v: string, idx: number) => {
                    setSelected(v)
                    props.onTeamSelected(v, idx)
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
                      containerProps={{ style: { "min-width": "10em" } }}
                      small
                      onClose={(v) => handleTeamSelected(v, i())}
                    />
                  )
                }}</Show>
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
                      const isHighlighted = () => highlightRace(raceDetails?.groupRace)
                      const teamOrdinal = (ti == 1 && t1idx < t2idx) || (ti == 2 && t2idx < t1idx) ? 1 : 2
                      const activeBorderColor = () => isHighlighted() ? highlightColour() : borderColour()
                      return (
                        <td
                          role="button"
                          data-testid={`race-${raceDetails.group}-${raceDetails.groupRace}-${teamOrdinal}`}
                          onMouseEnter={() => setHighlight(raceDetails.groupRace)}
                          onMouseLeave={() => setHighlight(prev => prev == raceDetails.groupRace ? null : prev)}
                          style={{
                            cursor: props.readonly ? "inherit" : "pointer",
                            "border-top": topBorder ? `${BORDER} ${activeBorderColor()}` : "",
                            "border-bottom": botBorder ? `${BORDER} ${activeBorderColor()}` : "",
                            "border-left": `${BORDER} ${activeBorderColor()}`,
                            "border-right": `${BORDER} ${activeBorderColor()}`,
                            position: "relative",
                            height: CELL_SIZE,
                            width: CELL_SIZE,
                            background: isHighlighted() ? `${highlightColour()}20` : "transparent",
                            transition: "border-color 0.12s ease, background 0.12s ease",
                          }}
                          onContextMenu={props.readonly ? null : [handleContext, { race: raceDetails, team }]}
                          onClick={() => !props.readonly && !raceDetails.winner && props.onResultChange?.({ ...raceDetails, winner: ti })}
                        >
                          <div style={{
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "center",
                            height: "100%",
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
                      <td style={{ width: "3px", background: borderColour(), opacity: 0.35 }} />
                    </Match>
                  </Switch>
                )
              }}</For>
              <Show when={!props.noResults}>{(_) => {
                const wins = () => teamPositions().data[team]?.wins
                const pos = () => teamPositions().pos.findIndex(p => p.includes(team))
                const posInfo = () => {
                  const p = pos()
                  const posLen = teamPositions().pos[p]?.length
                  if (posLen == teams().length) {
                    if (!props.races.some(r => r.winner)) {
                      return null
                    }
                  }
                  const joint = posLen > 1
                  switch (p) {
                    case 0: return { text: `${joint ? "=" : ""}1st`, rank: 1 }
                    case 1: return { text: `${joint ? "=" : ""}2nd`, rank: 2 }
                    case 2: return { text: `${joint ? "=" : ""}3rd`, rank: 3 }
                    default: return { text: `${joint ? "=" : ""}${p + 1}th`, rank: p + 1 }
                  }
                }
                return (
                  <>
                    <td style={{
                      height: CELL_SIZE,
                      width: CELL_SIZE,
                      "text-align": "center",
                      opacity: dimmed() ? 0.3 : 1,
                      transition: "opacity 0.15s ease",
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.disabled" }}>
                        {wins()}
                      </Typography>
                    </td>
                    <td style={{ "width": "3em" }}>
                      <Show when={(finished() || props.live) && posInfo()}>
                        {(info) => (
                          <Box sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 1,
                            py: 0.25,
                            borderRadius: "10px",
                            background: info().rank <= 3 ? RANK_GRADIENT[info().rank] : undefined,
                            bgcolor: info().rank <= 3 ? undefined : "action.selected",
                            boxShadow: info().rank <= 3 ? "0 2px 4px rgba(0,0,0,0.2)" : undefined,
                          }}>
                            <Typography sx={{
                              fontSize: "0.65rem",
                              fontWeight: info().rank <= 3 ? 800 : 700,
                              color: info().rank <= 3 ? "white" : "text.secondary",
                              lineHeight: 1,
                              whiteSpace: "nowrap",
                            }}>
                              {info().text}
                            </Typography>
                          </Box>
                        )}
                      </Show>
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
          anchorEl={props.anchor}
          open={!!props.anchor}
          onClose={(e) => {
            e.stopPropagation?.()
            props.onClose()
          }}
        >
          <MenuItem onClick={(e) => {
            e.stopPropagation()
            props.onClose()
            const update: Race = { ...race() }
            update.winner = update.team1 == props.team ? 1 : 2
            props.onResultChange(update)
          }}>winner</MenuItem>
          <Show when={race().indicators != "by"}>
            <MenuItem onClick={(e) => {
              e.stopPropagation()
              props.onClose()
              const update = { ...race() }
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
            props.onResultChange({
              ...race(),
              team1Dsq: false,
              team2Dsq: false,
              winner: undefined,
              indicators: undefined,
            })
          }}>reset</MenuItem>
        </Menu>
      )
    }}</Show>
  )
}
