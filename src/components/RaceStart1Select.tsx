import { Add } from "@suid/icons-material"
import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Select, MenuItem, IconButton, TextField } from "@suid/material"
import { batch, For, Show } from "solid-js"
import { createSignal } from "solid-js"
import { Division, useKings } from "../kings"

export type TeamNumbers = {
  [k in Division[number]]: number;
}

export type ClubTeamNumbers = {
  [club: string]: TeamNumbers;
}

type ComponentProps = {
  config: ClubTeamNumbers;
  onUpdate: (club: string, division: Division, count: number) => void;
}

export default function RaceStart1Select(props: ComponentProps) {
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
  })

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Club</TableCell>
              <TableCell align="center">Mixed</TableCell>
              <TableCell align="center">Ladies</TableCell>
              <TableCell align="center">Board</TableCell>
              <TableCell align="center">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <For each={Object.entries(props.config)}>{([club, teams]) => {
              return (
                <TableRow>
                  <TableCell>{club}</TableCell>
                  <TableCell align="center">
                    <Select
                      type="number"
                      size="small"
                      onChange={(e) => updateTeams(club, "mixed", e.target.value)}
                      value={teams.mixed}
                    >
                      <For each={[...Array(10).keys()]}>{(i) => {
                        return <MenuItem value={i}>{i}</MenuItem>
                      }}</For>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      type="number"
                      size="small"
                      onChange={(e) => updateTeams(club, "ladies", e.target.value)}
                      value={teams.ladies}
                    >
                      <For each={[...Array(10).keys()]}>{(i) => {
                        return <MenuItem value={i}>{i}</MenuItem>
                      }}</For>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    <Select
                      type="number"
                      size="small"
                      onChange={(e) => updateTeams(club, "board", e.target.value)}
                      value={teams.board}
                    >
                      <For each={[...Array(10).keys()]}>{(i) => {
                        return <MenuItem value={i}>{i}</MenuItem>
                      }}</For>
                    </Select>
                  </TableCell>
                  <TableCell align="center">
                    {teams.mixed + teams.ladies + teams.board}
                  </TableCell>
                </TableRow>
              )
            }}</For>
            <TableRow>
              <TableCell>
                <IconButton onClick={addTeam} size="small" color="info">
                  <Add />
                </IconButton>
                <TextField size="small" variant="outlined" onChange={e => setNewTeam(e.target.value)} />
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
