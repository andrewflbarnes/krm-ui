import { Add, ErrorOutlineRounded } from "@suid/icons-material"
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton, TextField, InputAdornment } from "@suid/material"
import { batch, createEffect, createMemo, For, Show } from "solid-js"
import { createSignal } from "solid-js"
import { ClubSeeding, Division, divisions, raceConfig } from "../kings"
import NumberField from "../ui/NumberField"
import PopoverButton from "../ui/PopoverButton"
import { createStore, produce } from "solid-js/store";

type ComponentProps = {
  config: ClubSeeding;
  onUpdate: (config: ClubSeeding) => void;
};

export default function ManageNewSelect(props: ComponentProps) {
  const [config, setConfig] = createStore<ClubSeeding>();

  createEffect(() => {
    setConfig(current => ({
      ...props.config,
      ...current,
    }))
  });

  const updateTeams = (club: string, division: Division, num: number) => {
    setConfig(club, produce(clubTeams => clubTeams[division] = num));
    props.onUpdate(config);
  };

  const total = createMemo(() => Object.values(config).reduce((acc, club) => {
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
    newTeam().length > 0 && !config[newTeam()]
  )
  const addTeam = () =>
    batch(() => {
      if (!config[newTeam()]) {
        setConfig(newTeam(), {
          mixed: 0,
          ladies: 0,
          board: 0,
        });
      }
      props.onUpdate(config);
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
    setErrors(errors)
  })

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ justifyContent: "center", display: "flex" }}
      >
        <Table
          sx={{ minWidth: 650, maxWidth: 1024 }}
          aria-label="simple table dense"
          size="small"
        >
          <TableHead>
            <TableRow>
              <TableCell>Club</TableCell>
              <For each={divisions}>{(division) =>
                <TableCell align="center">{division}</TableCell>
              }</For>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={Object.entries(config)}>{([club, teams]) => {
              return (
                <TableRow>
                  <TableCell>{club}</TableCell>
                  <For each={divisions}>{(division) => (
                    <TableCell
                      align="center"
                      sx={{ width: "1%", maxWidth: "fit-content" }}
                    >
                      <NumberField
                        onChange={(e) =>
                          updateTeams(club, division, +e.target.value >>> 0)
                        }
                        value={teams[division]}
                        zeroBlank
                      />
                    </TableCell>
                  )}</For>
                  <TableCell align="center">
                    {teams.mixed + teams.ladies + teams.board}
                  </TableCell>
                </TableRow>
              )
            }}</For>
            <TableRow>
              <TableCell>
                <TextField
                  data-testid="add-team"
                  size="small"
                  variant="outlined"
                  value={newTeam()}
                  onChange={e => setNewTeam(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
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
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell>Total</TableCell>
              <TableCell align="center">{total().mixed}</TableCell>
              <TableCell align="center">{total().ladies}</TableCell>
              <TableCell align="center">{total().board}</TableCell>
              <TableCell align="center">
                {total().mixed + total().ladies + total().board}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Show when={errors().length}>
        <PopoverButton
          title="Errors"
          messages={errors()}
          color="error"
          startIcon={<ErrorOutlineRounded />}
        />
      </Show>
    </>
  )
}
