import { asPosition, ConflictResolution, Division, GroupRaces, resolveDrawnTeams } from "@/kings";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, ToggleButton, ToggleButtonGroup, Typography } from "@suid/material";
import { createComputed, createEffect, createMemo, createSelector, createSignal, For, Show } from "solid-js";
import MiniLeague from "./MiniLeague";
import { DoubleArrow } from "@suid/icons-material";
import TeamOrderer from "@/ui/TeamOrderer";

const NO_OPTION_SENTINEL = ["Select an option"]

type DrawInfo = {
  position: number;
  teams: string[];
}

export default function RunRaceFixConflictModal(props: {
  open: boolean;
  initialConflicts: {
    division: Division;
    group: string;
    races: GroupRaces;
  }[];
  seeding: {
    [division in Division]: string[];
  },
  selectedGroup?: {
    division: Division;
    group: string;
  }
  onClose: () => void;
}) {
  const [confirm, setConfirm] = createSignal<ConflictResolution>()
  const [resolvedConflicts, setResolvedConflicts] = createSignal(props.initialConflicts)
  const [showIndex, setShowIndex] = createSignal<number>()
  const isSelected = createSelector(showIndex)

  const handleClose = () => {
    setConfirm(undefined)
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
      let results: string[] = null
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

  const [sizeRefs, setSizeRefs] = createSignal<HTMLDivElement[]>([])
  const updateRefs = (index: number, ref: HTMLDivElement) => {
    setSizeRefs(prev => {
      const newRefs = [...prev]
      newRefs[index] = ref
      return newRefs
    })
  }

  const [contentHeight, setContentHeight] = createSignal(0)
  createEffect(() => {
    const ret = sizeRefs().reduce((acc, ref) => {
      return acc > ref?.clientHeight ? acc : ref?.clientHeight
    }, 0)
    setContentHeight(ret)
  })

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

  return (
    <Dialog
      open={props.open}
      maxWidth="lg"
      onClose={handleClose}
      keepMounted
      sx={{
        position: props.open ? undefined : "relative",
        zIndex: props.open ? undefined : -1,
      }}
    >
      <DialogTitle style={{ "text-align": "center" }}>
        Resolved {resolved()} / {props.initialConflicts.length} conflict(s)
      </DialogTitle>
      <DialogContent>
        <div style={{
          display: "flex",
          "flex-direction": "column",
          overflow: "hidden",
          height: contentHeight() + "px",
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
                supplyRef={(ref) => updateRefs(i(), ref)}
                onUpdate={(ranking) => handleUpdate(i(), ranking)}
              />
            </div>
          )}</For>
        </div>
        <Show when={props.initialConflicts.length > 1}>
          <div
            style={{
              display: "flex",
              "justify-content": "center",
              "margin-top": "1em",
            }}
          >
            <Button
              onClick={next}
            >
              Next
            </Button>
          </div>
        </Show>
      </DialogContent>
      <DialogActions>
        <div style={{ display: "flex", "flex-direction": "column", gap: "0.5em", width: "100%" }}>
          <ToggleButtonGroup
            value={confirm()}
            onChange={(_, v) => v && changeResolutionType(v)}
            exclusive
            orientation="vertical"
            size="small"
            color="success"
          >
            <ToggleButton
              value="manual"
            >
              Manual
            </ToggleButton>
            <ToggleButton
              value="high"
            >
              High seed wins
            </ToggleButton>
            <ToggleButton
              value="low"
            >
              Low seed lose
            </ToggleButton>
            <ToggleButton
              value="seed"
            >
              Seed order
            </ToggleButton>
          </ToggleButtonGroup>
          <Button
            variant="contained"
            color="success"
            disabled={resolved() < props.initialConflicts.length}
          >
            Continue
          </Button>
        </div>
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
  supplyRef: (ref: HTMLDivElement) => void;
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
        props.supplyRef(ref)
      }}
      style={{
        display: "flex",
        "flex-direction": "column",
        gap: "1em",
        "max-width": "fit-content",
        "align-items": "center"
      }}
    >
      <div style={{ width: "fit-content" }}>
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
