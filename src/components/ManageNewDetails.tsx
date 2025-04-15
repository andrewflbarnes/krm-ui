import { Box, TextField } from "@suid/material";
import Selector from "../ui/Selector";

type Details = {
  description: string;
  venue: string;
  round: number;
}

const rounds = [1, 2, 3, 4]
  .map(r => ({
    label: `Round ${r}`,
    value: r,
  }))

export default function ManageNewDetails(props: Details & {
  onDetailUpdate: (details: Details) => void
}) {
  return (
    <Box displayRaw="flex" flexDirection="column" gap="1em">
      <Selector
        title="Round"
        options={rounds}
        current={props.round}
        onClose={v => props.onDetailUpdate({ ...props, round: v })}
      />
      <TextField
        label="Venue"
        value={props.venue}
        size="small"
        onChange={e => props.onDetailUpdate({ ...props, venue: e.currentTarget.value })}
      />
      <TextField
        label="Description"
        value={props.description}
        size="small"
        multiline
        minRows={2}
        onChange={e => props.onDetailUpdate({ ...props, description: e.currentTarget.value })}
      />
    </Box>
  )
}
