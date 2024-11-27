import { ArrowRight, Assignment, MoreVert } from "@suid/icons-material";
import { Chip, IconButton, Menu, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@suid/material";
import { createSignal, For, Show } from "solid-js";
import krmApi from "../api/krm";
import Link from "../components/Link";

const statusColor = {
  "Abandoned": "error",
  "In Progress": "warning",
  "Complete": "success",
}

export default function ManageContinue() {
  const rounds = krmApi.getRounds();

  const handleMore = (id: number, e: MouseEvent & { currentTarget: HTMLButtonElement }) => {
    e.stopPropagation()
    setAnchorEl(e.currentTarget);
    setMenuId(id);
  }
  const handleClose = () => {
    setAnchorEl(null);
    setMenuId(-1);
  }

  const [anchorEl, setAnchorEl] = createSignal<null | HTMLElement>(null);
  const [menuId, setMenuId] = createSignal(-1);
  const todo = (msg: string) => {
    setAnchorEl(null);
    setMenuId(-1);
    alert(msg)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table dense" size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell align="center">Mixed</TableCell>
            <TableCell align="center">Ladies</TableCell>
            <TableCell align="center">Board</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <For each={rounds}>{(round, id) => {
            const ariaId = () => `round-selector-menu-${id()}`
            return (
              <TableRow>
                <TableCell sx={{ width: "1%", minWidth: "fit-content" }}>
                  <Stack direction="row" gap="1em" alignItems="center">
                    <IconButton
                      id={`round-selector-button-${id()}`}
                      size="small"
                      onClick={[handleMore, id()]}
                      aria-controls={ariaId()}
                      aria-haspopup="true"
                      aria-expanded={menuId() == id() || undefined}
                    >
                      <MoreVert />
                    </IconButton>
                    <Show when={round.status != "In Progress"}>
                      <IconButton>
                        <Assignment />
                      </IconButton>
                    </Show>
                    <Show when={round.status == "In Progress"}>
                      <Link href={`/${round.id}`}>
                        <IconButton>
                          <ArrowRight color="success" />
                        </IconButton>
                      </Link>
                    </Show>
                    <Menu
                      id={ariaId()}
                      anchorEl={anchorEl()}
                      open={menuId() == id()}
                      onClose={handleClose}
                      MenuListProps={{ "aria-labelledby": "league-selector-button" }}
                    >
                      <MenuItem onClick={() => todo('todo')}>Export</MenuItem>
                      <MenuItem onClick={() => todo('todo - but probably not!')}>Delete</MenuItem>
                    </Menu>
                    {round.date.toLocaleDateString()}
                    <Chip size="small" label={round.league} color="primary" variant="outlined" />
                    <Chip size="small" label={round.status} color={statusColor[round.status] ?? "warning"} variant="outlined" />
                  </Stack>
                </TableCell>
                <TableCell align="center">
                  {round.teams["mixed"].length}
                </TableCell>
                <TableCell align="center">
                  {round.teams["ladies"].length}
                </TableCell>
                <TableCell align="center">
                  {round.teams["board"].length}
                </TableCell>
              </TableRow>
            )
          }}</For>
        </TableBody>
      </Table>
    </TableContainer>
  )
}
