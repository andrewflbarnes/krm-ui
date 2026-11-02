import { Box, IconButton } from "@suid/material"
import { createEffect, createMemo, createSignal, For, Show, untrack } from "solid-js"
import { Division, RoundSeeding } from "@/kings"
import StageCard from "@/ui/StageCard"
import { Replay } from "@suid/icons-material"
import TeamOrderer from "@/ui/TeamOrderer"

/**
  * Shows the seeding per division. Original seeds will default to seeds if not]
  * provided. Any teams not present in original seeds that are in seeds are
  * considered new and will be displayed at the bottom of the list if reset.
  *
  * @param originalSeeds the {RoundSeeding} prior to any shifts
  * @param seeds the {RoundSeeding} to display and adjust
  */
export default function RaceNewSeeding(props: {
  originalSeeds?: RoundSeeding;
  newSeeds?: RoundSeeding;
  seeds: RoundSeeding;
  editable?: boolean;
  onEdit?: (newSeeding: RoundSeeding) => void;
}) {
  const originalSeeds = createMemo<RoundSeeding>(() => {
    const seeds = untrack(() => props.seeds)
    // Add any seeds not in the originalSeeds to the end of the list for each division
    return props.originalSeeds
      ? Object.entries(props.seeds)
        .reduce((acc, [division, teams]: [Division, string[]]) => {
          teams.forEach((team) => {
            if (!acc[division].includes(team)) {
              acc[division].push(team)
            }
          })
          return acc
        }, {
          mixed: [...(props.originalSeeds?.mixed ?? [])],
          ladies: [...(props.originalSeeds?.ladies ?? [])],
          board: [...(props.originalSeeds?.board ?? [])],
        })
      : seeds
  })

  const initialSeeds = props.seeds // eslint-disable-line solid/reactivity
  const [seeds, setSeeds] = createSignal(initialSeeds)
  createEffect(() => {
    setSeeds(props.seeds)
  })
  return (
    <Box
      sx={{
        display: {
          xs: "flex",
          md: "grid",
        },
        width: "100%",
        mx: {
          xs: undefined,
          sm: "auto",
        },
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "1rem",
        justifyContent: "space-between",
        flexDirection: "column",
      }}
    >
      <For each={Object.entries(seeds())}>{([division, teams]: [Division, string[]]) => {
        const modified = () => {
          if (!props.editable) {
            return false
          }
          return !teams.every((team, i) => team === originalSeeds()[division][i])
        }

        const handleReset = () => {
          const currentSeeds = seeds()
          const nextSeeds = {
            ...currentSeeds,
            [division]: [...originalSeeds()[division]],
          }
          props.seeds[division]
            .filter(seed => !nextSeeds[division].includes(seed))
            .forEach((team) => {
              nextSeeds[division].push(team)
            })
          props.onEdit?.(nextSeeds)
          setSeeds(nextSeeds)
        }

        return (
          <Box sx={{ width: "100%" }}>
            <StageCard
              namer={() => "Seeds"}
              title={`${division.capitalize()} - ${teams.length} teams`}
              titleEndAdornment={
                <Show when={props.editable}>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={!modified()}
                    onClick={handleReset}
                    sx={{
                      background: "white"
                    }}
                  >
                    <Replay fontSize="small" />
                  </IconButton>
                </Show>
              }
              type={division}
              groups={[teams]}
            >{(group) => {
              const handleEdit = (newSeeds: string[]) => {
                if (props.editable) {
                  const nextRoundSeeding = {
                    ...seeds(),
                    [division]: newSeeds,
                  }
                  props.onEdit?.(nextRoundSeeding)
                  setSeeds(nextRoundSeeding)
                }
              }
              return (
                <TeamOrderer
                  onEdit={handleEdit}
                  division={division}
                  editable={props.editable}
                  originalSeeds={originalSeeds()[division]}
                  teams={group}
                  newSeeds={props.newSeeds?.[division]}
                  seeding
                />
              )
            }}</StageCard>
          </Box>
        )
      }}
      </For>
    </Box>
  )
}
