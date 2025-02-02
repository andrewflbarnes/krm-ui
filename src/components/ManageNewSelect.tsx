import { Add } from "@suid/icons-material"
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton, TextField, InputAdornment } from "@suid/material"
import { batch, For, Show } from "solid-js"
import { createSignal } from "solid-js"
import { ClubSeeding, Division, divisions, useKings } from "../kings"
import NumberField from "../ui/NumberField"

type ComponentProps = {
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, count: number) => void;
}

export default function ManageNewSelect(props: ComponentProps) {
  const [k] = useKings()
  return (
    <Show when={k.leagueConfig()} fallback={"TODO no race config for selected league"}>
      <TeamSelector config={props.config} onUpdate={props.onUpdate} />
    </Show>
  )
}

function TeamSelector(props: ComponentProps) {
  const updateTeams = (club: string, division: Division, num: number) => {
    props.onUpdate(club, division, num)
  }

  const total = () => Object.values(props.config).reduce((acc, club) => {
    acc.mixed += club.mixed
    acc.ladies += club.ladies
    acc.board += club.board
    return acc
  }, {
    mixed: 0,
    ladies: 0,
    board: 0,
  })

  const [newTeam, setNewTeam] = createSignal("")
  const addTeam = () => batch(() => {
    updateTeams(newTeam(), "mixed", 0)
    updateTeams(newTeam(), "ladies", 0)
    updateTeams(newTeam(), "board", 0)
    setNewTeam("")
  })

  return (
    <>
      <TableContainer component={Paper} sx={{ justifyContent: "center", display: "flex" }}>
        <Table sx={{ minWidth: 650, maxWidth: 1024 }} aria-label="simple table dense" size="small">
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
            <For each={Object.entries(props.config)}>{([club, teams]) => {
              return (
                <TableRow>
                  <TableCell>{club}</TableCell>
                  <For each={divisions}>{(division) =>
                    <TableCell align="center" sx={{ width: "1%", maxWidth: "fit-content" }}>
                      <NumberField
                        onChange={(e) => updateTeams(club, division, +e.target.value >>> 0)}
                        value={teams[division]}
                        zeroBlank
                      />
                    </TableCell>
                  }</For>
                  <TableCell align="center">
                    {teams.mixed + teams.ladies + teams.board}
                  </TableCell>
                </TableRow>
              )
            }}</For>
            <TableRow>
              <TableCell>
                <TextField
                  size="small"
                  variant="outlined"
                  value={newTeam()}
                  onChange={e => setNewTeam(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      <IconButton onClick={addTeam} disabled={newTeam()?.length == 0} size="small" color="info">
                        <Add />
                      </IconButton>
                    </InputAdornment>
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
              <TableCell align="center">{total().mixed + total().ladies + total().board}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
