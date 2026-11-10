import { asPosition, ConflictResolution, Division, GroupRaces, resolveDrawnTeams } from "@/kings";
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@suid/material";
import { createComputed, createEffect, createMemo, createSelector, createSignal, For, onCleanup, Show } from "solid-js";
import MiniLeague from "./MiniLeague";
import { ArrowForward, DoubleArrow } from "@suid/icons-material";
import TeamOrderer from "@/ui/TeamOrderer";

const NO_OPTION_SENTINEL = ["Select an option"]

export type Conflict = {
  division: Division;
  group: string;
  races: GroupRaces;
}

export default function RunRaceFixConflictModal(props: {
  open: boolean;
  initialConflicts: Conflict[];
  seeding: {
    [division in Division]: string[];
  },
  selectedGroup?: {
    division: Division;
    group: string;
  }
  onClose: () => void;
  onResolved: (resolvedConflicts: Conflict[]) => void;
}) {
  const [confirm, setConfirm] = createSignal<ConflictResolution>()
  const [resolvedConflicts, setResolvedConflicts] = createSignal<Conflict[]>(props.initialConflicts)
  const [showIndex, setShowIndex] = createSignal<number>()
  const isSelected = createSelector(showIndex)

  const handleClose = () => {
    props.onClose()
  }

  createComputed(() => {
    const selected = props.selectedGroup
      ? props.initialConflicts
        .findIndex(c => c.division === props.selectedGroup?.division && c.group === props.selectedGroup?.group)
      : 0
    setShowIndex(selected)
  })

  createComputed(() => {
    setConfirm(resolvedConflicts()?.[showIndex()]?.races?.overrideResults?.type)
  })

  // hack as no focus trap in suid - should add a proper one
  createEffect(() => {
    if (!props.open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose()
    }
    document.addEventListener("keydown", handler)
    onCleanup(() => document.removeEventListener("keydown", handler))
  })

  const changeResolutionType = (type: ConflictResolution) => {
    setResolvedConflicts(prev => prev?.map((c, i) => {
      if (i !== showIndex()) {
        return c
      }

      if (type === c?.races?.overrideResults?.type) {
        return c
      }

      switch (type) {
        case "manual":
        case "high":
        case "seed":
        case "low":
          break;
        default:
          console.error(`Invalid resolution type ${type}`)
          return c
      }

      let results: string[]
      if (type === "manual") {
        results = props.seeding[c.division].filter(team => c.races.teams.includes(team))
      } else if (type === "seed") {
        results = props.seeding[c.division].filter(team => c.races.teams.includes(team))
      } else {
        results = resolveDrawnTeams(
          c.races.teams,
          c.races.races,
          {
            method: type,
            seeds: props.seeding[c.division],
          }
        )
      }

      return {
        ...c,
        races: {
          ...c.races,
          overrideResults: {
            type,
            results,
          }
        }
      }
    }))
  }

  const next = () => {
    setShowIndex(prev => {
      if (prev === undefined) return 0
      if (prev + 1 >= props.initialConflicts.length) return 0
      return prev + 1
    })
  }

  const handleUpdate = (index: number, ranking: string[]) => {
    setResolvedConflicts(prev => prev.map((c, i) => {
      if (i !== index) {
        return c
      }
      const overrideResults = {
        type: c.races.overrideResults?.type ?? "manual",
        results: ranking,
      }
      return {
        ...c,
        races: {
          ...c.races,
          overrideResults,
        }
      }
    }))
  }

  const resolved = createMemo(() => {
    return resolvedConflicts().filter(({ races }) => races.overrideResults?.type && races.overrideResults?.results).length
  })

  const allResolved = createMemo(() => resolved() >= props.initialConflicts.length)

  const selectedConflictCount = createMemo(() => {
    return (resolvedConflicts()[showIndex()].races.results ?? []).filter(r => r.length > 1).length
  })

  return (
    <Dialog
      open={props.open}
      maxWidth="lg"
      onClose={handleClose}
      keepMounted
      fullScreen
      sx={{
        height: props.open ? undefined : 0,
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" gap={1.5}>
          <Typography variant="h6" component="span" fontWeight={600}>
            Resolve Draws
          </Typography>
          <Chip
            label={`${resolved()} / ${props.initialConflicts.length} resolved`}
            size="small"
            color={allResolved() ? "success" : "default"}
            variant={allResolved() ? "filled" : "outlined"}
          />
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 0.5 }}
        >
          {selectedConflictCount()} draw(s) for this group.
        </Typography>
      </DialogTitle>

      <DialogContent>
        <div style={{
          display: "flex",
          "flex-direction": "column",
          overflow: "hidden",
        }}>
          <For each={resolvedConflicts()}>{(conflict, i) => (
            <div style={{
              height: isSelected(i()) ? undefined : 0,
              overflow: "hidden",
              "max-width": "100%",
              "margin-left": "auto",
              "margin-right": "auto",
            }}>
              <Resolve
                division={conflict.division}
                seeding={props.seeding[conflict.division]}
                group={conflict.group}
                races={conflict.races}
                resolved={conflict.races.overrideResults}
                onUpdate={(ranking) => handleUpdate(i(), ranking)}
              />
            </div>
          )}</For>
        </div>
      </DialogContent>

      <DialogActions sx={{ p: 0 }}>
        <Stack direction="column" sx={{ width: "100%" }}>

          {/* Resolution method picker */}
          <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ display: "block", mb: 1, letterSpacing: "0.08em" }}
            >
              Resolution method
            </Typography>
            <ToggleButtonGroup
              value={confirm()}
              onChange={(_, v) => v && changeResolutionType(v)}
              exclusive
              size="small"
              color="success"
              fullWidth
              sx={{
                "& .MuiToggleButton-root": {
                  flexDirection: "column",
                  gap: 0.25,
                  py: 1,
                  textTransform: "none",
                  lineHeight: 1.2,
                },
              }}
            >
              <ToggleButton value="manual">
                <Typography variant="body2" fontWeight={600} component="span">Manual</Typography>
                <Typography variant="caption" color="inherit" component="span" sx={{ opacity: 0.7 }}>drag to rank</Typography>
              </ToggleButton>
              <ToggleButton value="high">
                <Typography variant="body2" fontWeight={600} component="span">High</Typography>
                <Typography variant="caption" color="inherit" component="span" sx={{ opacity: 0.7 }}>highest seed wins</Typography>
              </ToggleButton>
              <ToggleButton value="low">
                <Typography variant="body2" fontWeight={600} component="span">Low</Typography>
                <Typography variant="caption" color="inherit" component="span" sx={{ opacity: 0.7 }}>lowest seed loses</Typography>
              </ToggleButton>
              <ToggleButton value="seed">
                <Typography variant="body2" fontWeight={600} component="span">Seed</Typography>
                <Typography variant="caption" color="inherit" component="span" sx={{ opacity: 0.7 }}>by seeding order</Typography>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Divider />

          <Box sx={{ px: 2, py: 1.5 }}>
            <Stack direction="row" alignItems="center" gap={1}>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ flexShrink: 0 }}
                onClick={() => props.onClose()}
              >
                Cancel
              </Button>

              <Show when={props.initialConflicts.length > 1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ flex: 1, textAlign: "center", fontVariantNumeric: "tabular-nums" }}
                >
                  {(showIndex() ?? 0) + 1} of {props.initialConflicts.length}
                </Typography>

                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  endIcon={<ArrowForward />}
                  sx={{ flexShrink: 0 }}
                  onClick={next}
                >
                  Next
                </Button>
              </Show>

              {/* Spacer when only one conflict — push Continue to the right */}
              <Show when={props.initialConflicts.length <= 1}>
                <Box sx={{ flex: 1 }} />
              </Show>

              <Button
                variant="contained"
                color="success"
                size="small"
                disabled={!allResolved()}
                sx={{ flexShrink: 0 }}
                onClick={() => {
                  props.onResolved(resolvedConflicts())
                  handleClose()
                }}
              >
                Continue
              </Button>
            </Stack>
          </Box>
        </Stack>
      </DialogActions>
    </Dialog>
  )
}

function Resolve(props: {
  division: Division;
  group: string;
  races: GroupRaces;
  seeding: string[];
  resolved?: {
    type: ConflictResolution;
    results: string[];
  };
  onUpdate: (ranking: string[]) => void;
}) {
  let drawnPosition = 0
  const draws = () => props.races.results
    .map((teams, position) => {
      const ret = {
        realPosition: drawnPosition + 1,
        position: position + 1,
        teams,
      }
      drawnPosition += teams.length
      return ret
    })
    .filter(r => r.teams.length > 1)

  const resolvedDraws = () => {
    if (!props.resolved) {
      return draws().map(r => ({
        ...r,
        teams: NO_OPTION_SENTINEL,
      }))
    }
    return draws().map(r => {
      return {
        ...r,
        teams: props.resolved.results.filter(team => r.teams.includes(team)),
      }
    })
  }

  const handleUpdate = (position: number, ranking: string[]) => {
    const resolvedDraws = updateRanking(draws(), [{
      position,
      teams: ranking,
    }])

    const nextRaces = props.races.results.map((results, i) => {
      const draw = resolvedDraws.find(d => d.position === i + 1)
      if (draw) {
        return draw.teams
      }
      return results
    })

    const ordered = nextRaces.flat()
    props.onUpdate(ordered)
  }

  const [overlayMount, setOverlayMount] = createSignal<HTMLElement>()

  const isManual = createMemo(() => props.resolved?.type === "manual")

  return (
    <div
      ref={(ref: HTMLDivElement) => {
        setOverlayMount(ref)
      }}
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "1em",
        "max-width": "fit-content",
        "align-items": "center"
      }}
    >
      <div style={{ width: "100%", overflow: "auto" }}>
        <MiniLeague
          races={props.races.races}
          teams={props.races.teams}
          readonly
          name={props.division.capitalize() + " " + props.group}
          seeds={props.seeding}
        />
      </div>
      <For each={draws()}>{(draw, i) => (
        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            gap: "0.5em",
            "align-items": "center",
          }}
        >
          <div>{draw.teams.length}-way draw for {asPosition(draw.realPosition)}</div>
          <div
            style={{
              "display": "grid",
              "grid-template-columns": "1fr minmax(auto, 7em) 1fr",
              "align-items": "center",
            }}
          >
            <TeamList
              division={props.division}
              teams={draw.teams}
              seeded={props.seeding}
            />
            <div style={{ margin: "0 auto" }} >
              <DoubleArrow />
            </div>
            <TeamList
              division={props.division}
              teams={resolvedDraws()[i()].teams}
              seeded={props.seeding}
              manual={isManual()}
              overlayMount={overlayMount()}
              onUpdate={(ranking) => handleUpdate(draw.position, ranking)}
            />
          </div>
        </div>
      )}</For>
    </div >
  )
}

function TeamList(props: {
  division: Division;
  teams: string[];
  seeded: string[];
  manual?: boolean;
  overlayMount?: HTMLElement;
  onUpdate?: (ranking: string[]) => void;
}) {
  const handleEdit = (ranking: string[]) => {
    props.onUpdate?.(ranking)
  }

  return (
    <div style={{
      "margin": 0,
      "padding": 0,
      display: "flex",
      "flex-direction": "column",
      gap: "0.25em",
    }} >
      {/* For balance to prevent layout shifts with short team names */}
      <Typography variant="body2" color="textSecondary" sx={{ height: 0, overflow: "hidden" }}>
        Choose option...
      </Typography>
      <Show
        when={props.teams !== NO_OPTION_SENTINEL ? props.teams : false}
        fallback={
          <Typography variant="body2" color="textSecondary">
            Choose option...
          </Typography>
        }
        keyed
      >{(teams) => (
        <>
          {/* For balance to prevent layout shifts with short team names */}
          <Typography variant="body2" color="textSecondary" sx={{ height: 0, overflow: "hidden" }}>
            Choose option...
          </Typography>
          <TeamOrderer
            division={props.division}
            originalSeeds={props.seeded}
            initialTeams={teams}
            onEdit={handleEdit}
            editable={props.manual}
            overlayMount={props.overlayMount}
          />
        </>
      )}</Show>
    </div>
  )
}

type DrawInfo = {
  position: number;
  teams: string[];
}

function updateRanking(draws: DrawInfo[], resolutions: DrawInfo[]): DrawInfo[] {
  return draws.map(draw => {
    const resolution = resolutions.find(r => r.position === draw.position)
    if (resolution) {
      return {
        ...draw,
        teams: resolution.teams,
      }
    }
    return draw
  })
}
