import { Box, Button, Card, CardActions, CardContent, Chip, TextField, Typography } from "@suid/material";
import { untrack, createSignal, For } from "solid-js";
import { Result } from "../kings";

export type ToEdit = {
  division: string;
  row: Result;
}

export default function ConfigEditTeam(props: { edit: ToEdit, onDiscard: () => void, onConfirm: () => void }) {
  const [updated, setUpdate] = createSignal<Result>({ ...untrack(() => props.edit.row) })
  return (
    <Card sx={{ width: "20em" }}>
      <CardContent>
        <Typography variant="h4">
          {props.edit.row.name}
          &nbsp;
          <Chip label={props.edit.division} color="primary" size="small" variant="outlined" />
        </Typography>
        <Box sx={{ marginTop: "2em", display: "flex", flexDirection: "column", gap: "1em" }}>
          <For each={[1, 2, 3, 4]}>{(r) => (
            <TextField
              size="small"
              error={!Number.isInteger(+updated()[`r${r}`])}
              helperText={Number.isInteger(+updated()[`r${r}`]) || "Must be a number"}
              label={`Round ${r}`}
              value={updated()[`r${r}`]}
              onChange={(e) => setUpdate({ ...updated(), [`r${r}`]: e.target.value })} />
          )}</For>
        </Box>
      </CardContent>
      <CardActions>
        <Button onClick={props.onConfirm}>
          Save
        </Button>
        <Button color="error" onClick={props.onDiscard}>
          Discard
        </Button>
      </CardActions>
    </Card>
  )
}
