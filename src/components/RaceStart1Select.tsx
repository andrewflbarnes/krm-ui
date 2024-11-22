import { TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Select, MenuItem } from "@suid/material"
import { For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { useKings } from "../kings"

export type TeamNumbers = {
  mixed: number;
  ladies: number;
  board: number;
}

export type ClubTeamNumbers = {
  [club: string]: TeamNumbers;
}

export default function RaceStart1Select(props: { onUpdate: (data: ClubTeamNumbers) => void }) {
  const [k] = useKings()
  return (
    <Show when={k.leagueConfig()} fallback={"TODO no race config for selected league"}>
      <TeamSelector onUpdate={props.onUpdate} />
    </Show>
  )
}

function TeamSelector(props: { onUpdate: (data: ClubTeamNumbers) => void }) {
  const [k] = useKings()

  return (
    <Show when={k.leagueConfig()} fallback={"TODO no race config for selected league"}>
      <TeamSelectorTable onUpdate={props.onUpdate} />
    </Show>
  )
}

function TeamSelectorTable(props: { onUpdate: (data: ClubTeamNumbers) => void }) {
  const [k] = useKings()
  const [numTeams, setNumTeams] = createStore(Object.keys(k.leagueConfig()).reduce((acc, club) => {
    acc[club] = {
      mixed: 0,
      ladies: 0,
      board: 0,
    }
    return acc
  }, {} as ClubTeamNumbers))

  const updateTeams = (club: string, division: "mixed" | "ladies" | "board", num: number) => {
    setNumTeams(club, division, num)
    props.onUpdate({ ...numTeams })
  }

  const total = () => Object.values(numTeams).reduce((acc, club) => {
    acc.mixed += club.mixed
    acc.ladies += club.ladies
    acc.board += club.board
    return acc
  }, {
    mixed: 0,
    ladies: 0,
    board: 0,
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
            <For each={Object.entries(numTeams)}>{([club, teams]) => {
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
