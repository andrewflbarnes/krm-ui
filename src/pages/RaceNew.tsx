import { Box, Button, Stack, Typography } from "@suid/material"
import { batch, createEffect, createMemo, createSignal, JSX, lazy, on, onCleanup, Show } from "solid-js"
const RaceNewSetup = lazy(() => import("@/components/RaceNewSetup"))
const RaceNewSeeding = lazy(() => import("@/components/RaceNewSeeding"))
const RaceNewShuffle = lazy(() => import("@/components/RaceNewShuffle"))
import { ClubSeeding, Division, LeagueData, raceConfig, Round, RoundConfig, RoundSeeding } from "@/kings"
import { useKings } from "@/hooks/kings";
import krmEngine, { type RoundDetails } from "@/kings/engine"
import notification from "@/hooks/notification"
import { createRound, newTeams, orderSeeds } from "@/kings/utils"
import { A, useNavigate } from "@solidjs/router"
import BasicErrorBoundary from "@/ui/BasicErrorBoundary"
import { Construction, OpenInNew } from "@suid/icons-material"
import { initialisableAtomWithStorage } from "@/utils/jotai-utils"

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

export default function RaceNew() {
  return (
    <BasicErrorBoundary>
      <RaceNewInternal />
    </BasicErrorBoundary>
  )
}

function RaceNewInternal() {
  const [k, { addLeagueTeams, isConfigLoaded, lock, unlock }] = useKings()
  onCleanup(() => unlock())

  const [numTeams, setNumTeams] = useNumTeams(k.leagueConfig())

  createEffect(on([k.leagueConfig, k.league], ([newConfig, newLeague], _, prevLeague) => {
    batch(() => {
      setNumTeams(numTeams => {
        const newNumTeams = initConfig(newConfig)
        Object.entries(numTeams).forEach(([club, teams]) => {
          if (newLeague == prevLeague) {
            newNumTeams[club] = teams
          }
        })
        return newNumTeams
      })
      if (newLeague != prevLeague) {
        setDetails(details => ({
          ...details,
          venue: "",
        }))
      }
    })

    return newLeague
  }, { defer: true }), k.league())

  const handleTeamNumsUpdate = (club: string, division: Division, num: number) => {
    setNumTeams(config => {
      const clubConfig = config[club] || { mixed: 0, ladies: 0, board: 0 }
      return {
        ...config,
        [club]: {
          ...clubConfig,
          [division]: num,
        }
      }
    });
  }

  const [teamSelectErrors, setTeamSelectErrors] = createSignal<string[]>([]);

  const defaultSeason = (() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const [y1, y2] = month <= 8 ? [year - 1, year] : [year, year + 1]
    const fmt = (y: number) => String(y).slice(-2)
    return `${fmt(y1)}/${fmt(y2)}`
  })()

  const [details, setDetails] = createSignal<Omit<RoundDetails, 'league'>>({
    venue: "",
    description: "",
    round: "1",
    season: defaultSeason,
  })

  const roundDetails = (): RoundDetails => ({
    ...details(),
    league: k.league(),
  })

  const handleDetailUpdate = (d: ReturnType<typeof details>) => {
    setDetails(d)
  }

  const [distributionOrder, setDistributionOrder] = createSignal<RoundSeeding>();
  const [seeding, setSeeding] = createSignal<RoundSeeding>();
  const [originalSeeding, setOriginalSeeding] = createSignal<RoundSeeding>();
  const [originalConfig, setOriginalConfig] = createSignal<{
    [d in Division]: RoundConfig;
  }>()
  const navigate = useNavigate()
  const [round, setRound] = createSignal<Round>()

  type Step = {
    id: string;
    title?: string;
    content: () => JSX.Element;
    onArrive?: () => void;
    skip?: () => boolean;
    loadConfig?: boolean;
    validator: () => [boolean, string?]
  }

  const steps: Step[] = [
    {
      id: "setup",
      content: () => {
        return (
          <RaceNewSetup
            details={details()}
            onDetailUpdate={handleDetailUpdate}
            config={numTeams()}
            onUpdate={handleTeamNumsUpdate}
            onErrorUpdate={setTeamSelectErrors}
          />
        )
      },
      onArrive: unlock,
      loadConfig: true,
      validator: () => {
        if (teamSelectErrors().length > 0) {
          return [false, teamSelectErrors().join(", ")]
        }
        setOriginalSeeding(prev => prev ?? orderSeeds(k.leagueConfig(), numTeams()))
        const divisionCounts = Object.values(numTeams()).reduce((acc, next) => {
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
          .filter(([_, count]) => !raceConfig[count])
          .map(([division]) => division)
        if (noConfig.length > 0) {
          return [false, "Divisions have no config for requested number of teams: " + noConfig.join(", ")]
        }

        const lc = k.leagueConfig()
        const missing = Object.entries(numTeams()).reduce((acc, [club, teams]) => {
          Object.entries(teams).forEach(([division, num]) => {
            for (let i = 1; i <= num; i++) {
              if (lc?.[club]?.teams[division]?.[`${club} ${i}`] || (i == 1 && lc?.[club]?.teams[division]?.[club])) {
                continue
              }
              acc.push({ club, team: `${club} ${i}`, division })
            }
          })
          return acc
        }, [])

        if (missing.length > 0) {
          // TODO at round end set isNew to false for all teams that were in the round
          try {
            addLeagueTeams(missing)
            notification.success("Missing teams added")
          } catch (e) {
            return [false, e.message]
          }
        }

        const seeding = orderSeeds(k.leagueConfig(), numTeams())
        const r = createRound("setup", roundDetails(), seeding, raceConfig)
        batch(() => {
          setSeeding(seeding)
          setDistributionOrder(seeding)
          setRound(r)
          setOriginalConfig(r.config)
        })
        return [true,]
      }
    },
    {
      id: "adjust-seeds",
      title: "Adjust Seeds",
      onArrive: lock,
      content: () => {
        const handleEdit = (seeds: RoundSeeding) => {
          const r = createRound("setup", roundDetails(), seeds, raceConfig)
          batch(() => {
            setRound(r)
            setSeeding(seeds)
            setDistributionOrder(seeds)
          })
        }

        const newSeeds = createMemo(() => newTeams(k.leagueConfig()))
        // TODO pass isNew in as part of seeding
        return (
          <RaceNewSeeding
            originalSeeds={originalSeeding()}
            seeds={seeding()}
            newSeeds={newSeeds()}
            editable
            onEdit={handleEdit}
          />
        )
      },
      validator: () => {
        return [true,]
      }
    },
    {
      id: "adjust-groups",
      title: "Adjust Groups",
      content: () => {
        const handleShuffle = (seeds: RoundSeeding) => {
          const r = createRound("setup", roundDetails(), seeds, raceConfig)
          batch(() => {
            setRound(r)
            setDistributionOrder(seeds)
          })
        }
        return (
          <RaceNewShuffle
            seeding={seeding()}
            originalConfig={originalConfig()}
            round={round()}
            onShuffle={handleShuffle}
          />
        )
      },
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
    const r = krmEngine.createRound(roundDetails(), seeding(), raceConfig, distributionOrder())
    const [pass, err] = steps[step()].validator()
    if (pass) {
      unlock()
      navigate(`/races/${r.id}/stage1`)
    } else {
      notification.error(err)
    }
  }

  return (
    <Box data-testid={steps[step()].id} sx={{ height: 1, p: 1 }}>
      <Stack flexDirection="column" height="100%" gap="1em">
        <Show when={!isConfigLoaded(k.league()) && steps[step()].loadConfig} >
          <CallToLoadConfig />
        </Show>
        <Show when={steps[step()].title}>{(title) => (
          <Typography variant="h5" sx={{ textAlign: "center", fontWeight: 600 }}>
            {title()}
          </Typography>
        )}</Show>
        <Box sx={{ flexGrow: 1, display: "flex", overflow: "auto", alignItems: "start", justifyContent: "center" }}>
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
    </Box>
  )
}

function CallToLoadConfig() {
  const [{ loadingConfig, league }, { loadConfig }] = useKings()
  return (
    <Stack flexDirection="row" alignItems="center" justifyContent="center" gap="0.5em">
      <Button
        size="small"
        variant="outlined"
        onClick={[loadConfig, undefined]}
        startIcon={<Construction />}
        disabled={loadingConfig()}
      >
        Load {league().capitalize()} Config
      </Button>
      <Box sx={{
        display: {
          xs: "none",
          sm: "inherit",
        },
        alignItems: "center",
      }}>
        or custom configuration from
        &nbsp;
        <A href="/teams" style={{ "text-decoration": "none" }}>
          <Typography color="primary" style={{ display: "inline" }}>
            <Stack direction="row" alignItems="center" gap="0.1em">
              teams page
              <OpenInNew fontSize="small" />
            </Stack>
          </Typography>
        </A>
      </Box>
    </Stack>
  )
}

function useNumTeams(leagueConfig: LeagueData) {
  const initialConfig = initConfig(leagueConfig)
  const useTeamsAtom = initialisableAtomWithStorage<ClubSeeding>(
    "race-new-num-teams",
    initialConfig,
  )
  const [getter, setter] = useTeamsAtom()
  setter(prev => {
    try {
      const next = {
        ...initialConfig,
      }
      for (const club of Object.keys(initialConfig)) {
        if (prev[club]) {
          next[club] = prev[club]
        }
      }
      return next
    } catch (e) {
      console.error("Failed to merge previous config", prev, initialConfig, e)
      return initialConfig
    }
  })
  return [getter, setter] as const
}
