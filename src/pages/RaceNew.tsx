import { Box, Button, Paper, Stack, Typography } from "@suid/material"
import { batch, createEffect, createSignal, JSX, lazy, on, onCleanup, Show } from "solid-js"
const ManageNewUpdateTeams = lazy(() => import("../components/ManageNewUpdateTeams"))
const ManageNewConfirm = lazy(() => import("../components/ManageNewConfirm"))
const ManageNewShuffle = lazy(() => import("../components/ManageNewShuffle"))
import { ClubSeeding, Division, LeagueData, raceConfig, Round, RoundConfig, RoundSeeding, useKings } from "../kings"
import krmApi from "../api/krm"
import notification from "../hooks/notification"
import { createRound, orderSeeds } from "../kings/utils"
import { A, useNavigate } from "@solidjs/router"
import BasicErrorBoundary from "../ui/BasicErrorBoundary"
const ManageNewSetup = lazy(() => import("../components/ManageNewSetup"))
import { Construction, OpenInNew } from "@suid/icons-material"

const raceConfigs = raceConfig

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
  const [k, { addLeagueTeams, lock, unlock }] = useKings()
  onCleanup(() => unlock())

  const [numTeams, setNumTeams] = createSignal<ClubSeeding>(initConfig(k.leagueConfig()))
  createEffect(on(k.leagueConfig, (newConfig) => {
    setNumTeams(numTeams => {
      const newNumTeams = initConfig(newConfig)
      Object.entries(numTeams).forEach(([club, teams]) => {
        if (newNumTeams[club]) {
          newNumTeams[club] = teams
        }
      })
      return newNumTeams
    })
  }, { defer: true }))

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

  const [missingTeams, setMissingTeams] = createSignal<{
    club: string,
    team: string,
    division: string
  }[]>();

  const [details, setDetails] = createSignal<{
    description: string;
    venue: string;
    round: string;
  }>({
    venue: "",
    description: "",
    round: "1",
  })
  const roundDetails = () => ({
    ...details(),
    league: k.league(),
  })

  const handleDetailUpdate = (d: ReturnType<typeof details>) => {
    setDetails(d)
  }

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
    loadConfig?: boolean;
    validator: () => [boolean, string?]
  }

  const steps: Step[] = [
    {
      title: "Setup",
      content: () => {
        return (
          <ManageNewSetup
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

        const seeding = orderSeeds(k.leagueConfig(), numTeams())
        const r = createRound("setup", roundDetails(), seeding, raceConfigs)
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
      title: "Shuffle Teams",
      content: () => {
        const handleShuffle = (seeds: RoundSeeding) => {
          const r = createRound("setup", roundDetails(), seeds, raceConfigs)
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
    const r = krmApi.createRound(roundDetails(), seeding(), raceConfigs, distributionOrder())
    const [pass, err] = steps[step()].validator()
    if (pass) {
      unlock()
      navigate(`/races/${r.id}/stage1`)
    } else {
      notification.error(err)
    }
  }

  return (
    <Paper sx={{ height: 1, p: 1 }}>
      <Stack flexDirection="column" height="100%" gap="1em">
        <Show when={!k.leagueConfig() && steps[step()].loadConfig} >
          <CallToLoadConfig />
        </Show>
        <Box sx={{ flexGrow: 1, display: "flex", overflow: "scroll", alignItems: "start", justifyContent: "center" }}>
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
    </Paper>
  )
}

function CallToLoadConfig() {
  const [{ loadingConfig, league }, { loadConfig }] = useKings()
  /*
    const nav = useNavigate()
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
      <ButtonCard
        label={`Load ${league().capitalize()} config`}
        description="Or click the settings icon in the top right to load custom config"
        icon={<Construction fontSize="large" />}
        onClick={[loadConfig, undefined]}
        disabled={loadingConfig()}
      />
      <ButtonCard
        label={`Load custom ${league().capitalize()} config`}
        description="Load custom config from the teams page"
        icon={<OpenInNew fontSize="large" />}
        onClick={[nav, "/teams"]}
        disabled={loadingConfig()}
      />
    </Box>
  */
  return (
    <Stack flexDirection="row" alignItems="center" justifyContent="center" gap="0.5em">
      <Button
        size="small"
        variant="outlined"
        onClick={[loadConfig, undefined]}
        startIcon={<Construction />}
        disabled={loadingConfig()}
      >
        Load {league()} Config
      </Button>
      {" "}or load custom configuration from the{" "}
      <A href="/teams" style={{ "text-decoration": "none" }}>
        <Typography color="primary" style={{ display: "inline" }}>
          <Stack direction="row" alignItems="center" gap="0.1em">
            teams page
            <OpenInNew fontSize="small" />
          </Stack>
        </Typography>
      </A>
    </Stack>
  )
}
