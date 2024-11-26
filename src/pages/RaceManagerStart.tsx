import { Box, Button, Stack } from "@suid/material"
import { createEffect, createSignal, onCleanup, Show } from "solid-js"
import RaceStart1Select, { ClubTeamNumbers } from "../components/RaceStart1Select"
import RaceStart2UpdateTeams from "../components/RaceStart2UpdateTeams"
import RaceStart3Confirm from "../components/RaceStart3Confirm"
import { Division, useKings } from "../kings"
import notification from "../hooks/notification"
import { createStore } from "solid-js/store"

export default function RaceManagerStart() {
  const [k, { addLeagueTeams, lock, unlock }] = useKings()
  const [numTeams, setNumTeams] = createStore(Object.keys(k.leagueConfig()).reduce((acc, club) => {
    acc[club] = {
      mixed: 0,
      ladies: 0,
      board: 0,
    }
    return acc
  }, {} as ClubTeamNumbers))

  const handleTeamNumsUpdate = (club: string, division: Division, count: number) => {
    setNumTeams(club, division, count)
  }
  onCleanup(() => unlock())

  const [missingTeams, setMissingTeams] = createSignal<{
    club: string,
    team: string,
    division: string
  }[]>();

  const steps = [
    {
      title: "Select Teams",
      content: () => <RaceStart1Select config={numTeams} onUpdate={handleTeamNumsUpdate} />,
      onArrive: unlock,
      validator: () => {
        const divisionCounts = Object.values(numTeams).reduce((acc, next) => {
          acc.mixed += next.mixed
          acc.ladies += next.ladies
          acc.board += next.board
          return acc
        }, {
          mixed: 0,
          ladies: 0,
          board: 0,
        })
        const lowDivisions = Object.entries(divisionCounts)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, count]) => count < 4)
          .map(([division]) => division)
        if (lowDivisions.length > 0) {
          return [false, "Divisions must have at least 4 teams: " + lowDivisions.join(", ")]
        }

        const lc = k.leagueConfig()
        const missing = Object.entries(numTeams).reduce((acc, [club, teams]) => {
          Object.entries(teams).forEach(([division, num]) => {
            for (let i = 1; i <= num; i++) {
              if (lc[club]?.teams[division]?.[`${club} ${i}`] || (i == 1 && lc[club]?.teams[division]?.[club])) {
                continue
              }
              acc.push({ club, team: `${club} ${i}`, division })
            }
          })
          return acc
        }, [])
        setMissingTeams(missing)
        return [true,]
      }
    },
    {
      title: "Update teams",
      content: () => <RaceStart2UpdateTeams missingTeams={missingTeams()} />,
      onArrive: lock,
      validator: () => {
        if (missingTeams().length < 1) {
          return [true,]
        }
        try {
          notification.info("Adding league teams")
          addLeagueTeams(missingTeams())
          notification.success("Teams added")
          return [true,]
        } catch (e) {
          return [false, e.message]
        }
      }
    },
    {
      title: "Dummy 1",
      content: () => <RaceStart3Confirm data={numTeams} />,
      validator: () => {
        unlock()
        return [true,]
      }
    },
  ]

  const [step, setStep] = createSignal(0)

  const handleNext = () => {
    const [pass, err] = steps[step()].validator()
    if (pass) {
      setStep(step() + 1)
    } else {
      notification.error(err)
    }
  }

  const handlePrev = () => {
    if (step() > 0) {
      setStep(step() - 1)
    }
  }

  const handleDone = () => {
    const [pass, err] = steps[step()].validator()
    if (pass) {
      alert("TODO done")
    } else {
      notification.error(err)
    }
  }

  createEffect(() => steps[step()].onArrive?.())

  return (
    <Stack flexDirection="column" height="100%">
      <Box sx={{ flexGrow: 1 }}>
        {steps[step()].content()}
      </Box>
      <Stack gap="8px" flexDirection="row" sx={{ width: "100%", marginTop: "auto" }}>
        <Show when={step() > 0}>
          <Button sx={{ flexBasis: 0, flexGrow: 1 }} variant="contained" fullWidth onClick={handlePrev}>Previous</Button>
        </Show>
        <Show when={step() < steps.length - 1}>
          <Button sx={{ flexBasis: 0, flexGrow: 1 }} variant="contained" fullWidth onClick={handleNext}>Next</Button>
        </Show>
        <Show when={step() == steps.length - 1}>
          <Button sx={{ flexBasis: 0, flexGrow: 1 }} variant="contained" fullWidth onClick={handleDone}>Done</Button>
        </Show>
      </Stack>
    </Stack>
  )
}
