import { Box, Button, Stack } from "@suid/material"
import { batch, createEffect, createSignal, JSX, lazy, on, onCleanup, Show } from "solid-js"
const ManageNewSelect = lazy(() => import("../components/ManageNewSelect"))
const ManageNewUpdateTeams = lazy(() => import("../components/ManageNewUpdateTeams"))
const ManageNewConfirm = lazy(() => import("../components/ManageNewConfirm"))
const ManageNewShuffle = lazy(() => import("../components/ManageNewShuffle"))
import { ClubSeeding, Division, LeagueData, raceConfig, Round, RoundConfig, RoundSeeding, useKings } from "../kings"
import krmApi from "../api/krm"
import notification from "../hooks/notification"
import { createStore } from "solid-js/store"
import { createRound, orderSeeds } from "../kings/utils"
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
  createEffect((lastLeague) => {
    const league = k.league()
    if (lastLeague == league) {
      setNumTeams(nt => ({
        ...initConfig(k.leagueConfig()),
        ...nt,
      }))
    } else {
      batch(() => {
        Object.keys(numTeams).forEach(club => setNumTeams(club, undefined))
        setNumTeams(initConfig(k.leagueConfig()))
      })
    }
    return league
  }, k.league())

  const handleTeamNumsUpdate = (club: string, division: Division, count: number) => {
    setNumTeams(club, { [division]: count })
  }

  const [missingTeams, setMissingTeams] = createSignal<{
    club: string,
    team: string,
    division: string
  }[]>();

  const [distributionOrder, setDistributionOrder] = createSignal<RoundSeeding>();
  const [seeding, setSeeding] = createSignal<RoundSeeding>();
  const [originalConfig, setOriginalConfig] = createSignal<{
    [d in Division]: RoundConfig;
  }>()
  const navigate = useNavigate()
  const [round, setRound] = createSignal<Round>()

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
        const noConfig = Object.entries(divisionCounts)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, count]) => !raceConfig[count])
          .map(([division]) => division)
        if (noConfig.length > 0) {
          return [false, "Divisions have no config for requested number of teams: " + noConfig.join(", ")]
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
            addLeagueTeams(missingTeams())
            notification.success("Missing teams added")
          } catch (e) {
            return [false, e.message]
          }
        }

        const seeding = orderSeeds(k.leagueConfig(), numTeams)
        const r = createRound("setup", k.league(), seeding)
        batch(() => {
          setDistributionOrder(seeding)
          setSeeding(seeding)
          setRound(r)
          setOriginalConfig(r.config)
        })

        return [true,]
      }
    },
    {
      title: "Shuffle Teans",
      content: () => {
        const handleShuffle = (seeds: RoundSeeding) => {
          const r = createRound("setup", k.league(), seeds)
          batch(() => {
            setRound(r)
            setDistributionOrder(seeds)
          })
        }
        return <ManageNewShuffle seeding={seeding()} originalConfig={originalConfig()} round={round()} onShuffle={handleShuffle} />
      },
      validator: () => {
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
    const r = krmApi.createRound(k.league(), seeding(), distributionOrder())
    const [pass, err] = steps[step()].validator()
    if (pass) {
      unlock()
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
