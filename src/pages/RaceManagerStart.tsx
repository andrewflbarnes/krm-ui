import { Alert, Box, Button, Stack } from "@suid/material"
import { createSignal, Show } from "solid-js"
import toast from "solid-toast"
import RaceStart1Select, { ClubTeamNumbers } from "../components/RaceStart1Select"
import RaceStart2UpdateTeams from "../components/RaceStart2UpdateTeams"
import RaceStart3Confirm from "../components/RaceStart3Confirm"

export default function RaceManagerStart() {
  const [clubTeamNumbers, setClubTeamNumbers] = createSignal<ClubTeamNumbers>({})
  const handleTeamNumsUpdate = (data: ClubTeamNumbers) => {
    setClubTeamNumbers(data)
  }
  const steps = [
    {
      title: "Select Teams",
      content: <RaceStart1Select onUpdate={handleTeamNumsUpdate} />,
      validator: () => {
        // TODO better
        const divisionCounts = Object.values(clubTeamNumbers()).reduce((acc, next) => {
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
          .filter(([_, count]) => count < 4)
          .map(([division]) => division)
        return [lowDivisions.length == 0, "Divisions must have at least 4 teams: " + lowDivisions.join(", ")]
      }
    },
    {
      title: "Update teams",
      content: <RaceStart2UpdateTeams data={clubTeamNumbers()} />,
      validator: () => [true,]
    },
    {
      title: "Dummy 1",
      content: <RaceStart3Confirm data={clubTeamNumbers()} />,
      validator: () => [true,]
    },
  ]

  const [step, setStep] = createSignal(0)

  const handleNext = () => {
    const [pass, err] = steps[step()].validator()
    if (pass) {
      setStep(step() + 1)
    } else {
      toast.custom((t) => (
        <Alert severity="error" action={(
          <Button color="inherit" size="small" onClick={[toast.dismiss, t.id]}>
            DISMISS
          </Button>
        )}>
          {err}
        </Alert>
      ))
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
      toast.custom((t) => (
        <Alert severity="error" action={(
          <Button color="inherit" size="small" onClick={[toast.dismiss, t.id]}>
            DISMISS
          </Button>
        )}>
          {err}
        </Alert>
      ))
    }
  }

  return (
    <Stack flexDirection="column" height="100%">
      <Box sx={{ flexGrow: 1 }}>
        {steps[step()].content}
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
