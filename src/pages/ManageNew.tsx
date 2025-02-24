import { Box, Button, Stack } from "@suid/material"
import { createEffect, createSignal, JSX, lazy, on, onCleanup, Show } from "solid-js"
const ManageNewSelect = lazy(() => import("../components/ManageNewSelect"))
const ManageNewUpdateTeams = lazy(() => import("../components/ManageNewUpdateTeams"))
const ManageNewConfirm = lazy(() => import("../components/ManageNewConfirm"))
import { ClubSeeding, Division, LeagueData, RoundSeeding, useKings } from "../kings"
import krmApi from "../api/krm"
import notification from "../hooks/notification"
import { createStore } from "solid-js/store"
import { orderSeeds } from "../kings/utils"
import { useNavigate } from "@solidjs/router"
import BasicErrorBoundary from "../ui/BasicErrorBoundary"

export default function ManageNew() {
  return (
    <BasicErrorBoundary>
      <ManageNewInternal />
    </BasicErrorBoundary>
  )
}

function initConfig(leagueConfig?: LeagueData) {
  return Object.keys(leagueConfig ?? {}).reduce((acc, club) => {
    acc[club] = {
      mixed: 0,
      ladies: 0,
      board: 0,
    }
    return acc
  }, {})
}

function ManageNewInternal() {
  const [k, { addLeagueTeams, lock, unlock }] = useKings()
  onCleanup(() => unlock())

  const [numTeams, setNumTeams] = createStore<ClubSeeding>(initConfig(k.leagueConfig()))
  createEffect(() => {
    setNumTeams(initConfig(k.leagueConfig()))
  })

  const handleTeamNumsUpdate = (club: string, division: Division, count: number) => {
    setNumTeams(club, { [division]: count })
  }

  const [missingTeams, setMissingTeams] = createSignal<{
    club: string,
    team: string,
    division: string
  }[]>();

  const [seeding, setSeeding] = createSignal<RoundSeeding>();
  const navigate = useNavigate()

  type Step = {
    title: string;
    content: () => JSX.Element;
    onArrive?: () => void;
    skip?: () => boolean;
    validator: () => [boolean, string?]
  }

  const steps: Step[] = [
    {
      title: "Select Teams",
      content: () => <ManageNewSelect config={numTeams} onUpdate={handleTeamNumsUpdate} />,
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
          .filter(([_, count]) => count < 3)
          .map(([division]) => division)
        if (lowDivisions.length > 0) {
          return [false, "Divisions must have at least 3 teams: " + lowDivisions.join(", ")]
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
      content: () => <ManageNewUpdateTeams missingTeams={missingTeams()} />,
      onArrive: lock,
      skip: () => missingTeams().length < 1,
      validator: () => {
        if (missingTeams().length > 0) {
          try {
            notification.info("Adding league teams")
            addLeagueTeams(missingTeams())
            notification.success("Teams added")
          } catch (e) {
            return [false, e.message]
          }
        }

        const seeding = orderSeeds(k.leagueConfig(), numTeams)
        setSeeding(seeding)

        return [true,]
      }
    },
    {
      title: "Confirm",
      content: () => <ManageNewConfirm seeds={seeding()} />,
      validator: () => {
        return [true,]
      }
    },
  ]

  const [step, setStep] = createSignal(0)
  const [skipped, setSkipped] = createSignal([])
  createEffect(on(seeding, () => {
    setSkipped([])
  }))
  const handleNext = () => {
    const [pass, err] = steps[step()].validator()
    if (!pass) {
      notification.error(err)
      return
    }
    let nextStep = step() + 1
    steps[nextStep].onArrive?.()
    const skips = []
    while (steps[nextStep].skip?.()) {
      skips.push(nextStep)
      steps[nextStep].validator()
      nextStep++
      steps[nextStep].onArrive?.()
    }
    setSkipped(prev => prev.concat(skips))
    setStep(nextStep)
  }

  const handlePrev = () => {
    console.log(skipped())
    if (step() > 0) {
      let nextStep = step() - 1
      while (skipped().includes(nextStep) && nextStep > 0) {
        steps[nextStep].onArrive?.()
        nextStep--
      }
      setStep(nextStep)
      steps[nextStep].onArrive?.()
    }
  }

  const handleDone = () => {
    notification.info("Creating round")
    const r = krmApi.createRound(k.league(), seeding())
    const [pass, err] = steps[step()].validator()
    if (pass) {
      unlock()
      notification.success("Created round")
      navigate(`/${r.id}`)
    } else {
      notification.error(err)
    }
  }

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
