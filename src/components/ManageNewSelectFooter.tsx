import { batch, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { Box, Chip, Divider, IconButton, InputAdornment, Paper, Stack, TextField, Typography } from "@suid/material"
import { ClubSeeding, Division, divisions, raceConfig } from "../kings"
import { DIVISION_ACCENT } from "../theme";
import PopoverButton from "../ui/PopoverButton";
import { Add, ErrorOutlineRounded } from "@suid/icons-material";

export default function ManageNewSelectFooter(props: {
  config: ClubSeeding,
  onUpdate: (club: string, division: Division, num: number) => void,
  onErrorUpdate?: (errors: string[]) => void,
}) {
  const [newTeam, setNewTeam] = createSignal("");

  const total = createMemo(() => Object.values(props.config).reduce((acc, club) => {
    acc.mixed += club.mixed
    acc.ladies += club.ladies
    acc.board += club.board
    return acc
  }, {
    mixed: 0,
    ladies: 0,
    board: 0,
  }))

  const canAddNewTeam = createMemo(() =>
    newTeam().length > 0 && !props.config[newTeam()]
  )
  const addTeam = () =>
    batch(() => {
      divisions.forEach(division => props.onUpdate(newTeam(), division, 0))
      setNewTeam("");
    });

  const [errors, setErrors] = createSignal<string[]>([])
  createEffect(() => {
    const errors = []
    if ((total().mixed + total().ladies + total().board) == 0) {
      errors.push("No teams are entered to compete")
    }
    if (!raceConfig[total().mixed]) {
      errors.push(`Mixed: no configuration for ${total().mixed} teams`)
    }
    if (!raceConfig[total().ladies]) {
      errors.push(`Ladies: no configuration for ${total().ladies} teams`)
    }
    if (!raceConfig[total().board]) {
      errors.push(`Board: no configuration for ${total().board} teams`)
    }
    props.onErrorUpdate?.(errors)
    setErrors(errors)
  })

  return (
    <Stack direction="column" alignItems="center" gap={1}>
      <Paper
        variant="outlined"
        sx={{
          borderStyle: "dashed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          py: 2,
        }}
      >
        <TextField
          data-testid="add-team"
          size="small"
          variant="outlined"
          placeholder="Club name"
          value={newTeam()}
          onChange={e => setNewTeam(e.target.value)}
          onKeyDown={e => e.key === "Enter" && canAddNewTeam() && addTeam()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={addTeam}
                  disabled={!canAddNewTeam()}
                  size="small"
                  color="info"
                >
                  <Add />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <Paper
        elevation={3}
        variant="outlined"
        sx={{
          width: "100%",
          px: 2,
          py: 1,
          borderRadius: 1,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ mr: 0.5 }}>
            Total
          </Typography>
          <Chip label={total().mixed + total().ladies + total().board} size="small" sx={{ width: 32, "& .MuiChip-label": { px: 0, textAlign: "center" } }} />
          <Divider orientation="vertical" flexItem />
          <For each={divisions}>{(division) => (
            <Stack direction="row" alignItems="center" gap={0.5}>
              <Typography variant="caption" sx={{ textTransform: "capitalize" }}>
                {division}
              </Typography>
              <Chip color={`${DIVISION_ACCENT[division].text}`} label={total()[division]} size="small" sx={{ width: 32, "& .MuiChip-label": { px: 0, textAlign: "center" } }} />
            </Stack>
          )}</For>
        </Box>
        <Show when={errors().length}>
          <Box
            sx={{
              height: 0,
              overflow: "visible",
              display: "flex",
              alignItems: "center",
            }}
          >
            <PopoverButton
              title="Errors"
              messages={errors()}
              color="error"
              startIcon={<ErrorOutlineRounded />}
            />
          </Box>
        </Show>
      </Paper>

    </Stack>
  )
}
