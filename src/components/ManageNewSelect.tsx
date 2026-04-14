import { Add, ErrorOutlineRounded } from "@suid/icons-material"
import { Box, Card, CardContent, Chip, Divider, IconButton, InputAdornment, Stack, TextField, Typography } from "@suid/material"
import { batch, createEffect, createMemo, For, Show } from "solid-js"
import { createSignal } from "solid-js"
import { ClubSeeding, Division, divisions, raceConfig } from "../kings"
import NumberField from "../ui/NumberField"
import PopoverButton from "../ui/PopoverButton"

type ComponentProps = {
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, num: number) => void;
  onErrorUpdate?: (errors: string[]) => void;
};

export default function ManageNewSelect(props: ComponentProps) {
  const clubs = () => Object.keys(props.config).sort((a, b) => a.localeCompare(b));

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

  const [newTeam, setNewTeam] = createSignal("");
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 0.5,
        }}
      >
        <For each={clubs()}>{(club) => {
          const teams = () => props.config[club];
          const clubTotal = () => teams().mixed + teams().ladies + teams().board;
          return (
            <Card data-testid={`club-${club}`}>
              <CardContent sx={{ py: "6px !important", px: "12px !important" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="caption" fontWeight="bold" sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {club}
                  </Typography>
                  <For each={divisions}>{(division) => (
                    <Stack alignItems="center" spacing={0}>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1, fontSize: "0.6rem" }}>
                        {division.charAt(0).toUpperCase()}
                      </Typography>
                      <Box sx={{ width: "40px" }}>
                        <NumberField
                          onChange={(e) =>
                            props.onUpdate(club, division, +e.target.value >>> 0)
                          }
                          value={teams()[division]}
                          zeroBlank
                        />
                      </Box>
                    </Stack>
                  )}</For>
                  <Chip label={clubTotal()} size="small" sx={{ height: 18, fontSize: "0.65rem", width: 32, "& .MuiChip-label": { px: 0, textAlign: "center" } }} />
                </Stack>
              </CardContent>
            </Card>
          )
        }}</For>
      </Box>

      <Card
        variant="outlined"
        sx={{
          borderStyle: "dashed",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80px",
        }}
      >
        <CardContent>
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
        </CardContent>
      </Card>

      <Box
        sx={{
          px: 2,
          py: 1,
          bgcolor: "action.hover",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
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
            <Chip label={total()[division]} size="small" sx={{ width: 32, "& .MuiChip-label": { px: 0, textAlign: "center" } }} />
          </Stack>
        )}</For>
      </Box>

      <Show when={errors().length}>
        <Box sx={{ mt: 2 }}>
          <PopoverButton
            title="Errors"
            messages={errors()}
            color="error"
            startIcon={<ErrorOutlineRounded />}
          />
        </Box>
      </Show>
    </Box>
  )
}
