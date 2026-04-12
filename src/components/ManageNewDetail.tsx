import { For } from "solid-js";
import { Box, Card, CardContent, Divider, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@suid/material";
import { LocationOn, Notes } from "@suid/icons-material";

export type Details = {
  description: string;
  venue: string;
  round: string;
}

type ManageNewDetailProps = {
  details: Details;
  onDetailUpdate: (details: Details) => void;
}

const rounds = [1, 2, 3, 4]

export default function ManageNewDetail(props: ManageNewDetailProps) {
  return (

      <Card
        variant="outlined"
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={700} letterSpacing={-0.5}>
              Race Details
            </Typography>
            <Divider sx={{ mt: 1 }} />
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={2}>
              Round
            </Typography>
            <ToggleButtonGroup
              value={props.details.round}
              exclusive
              onChange={(_, value) => value && props.onDetailUpdate({ ...props.details, round: value })}
              sx={{ width: "100%", mt: 0.5 }}
            >
              <For each={rounds}>
                {(r) => (
                  <ToggleButton
                    value={r.toString()}
                    sx={{ flex: 1, fontSize: "1.1rem", fontWeight: 700, py: 1 }}
                  >
                    {r}
                  </ToggleButton>
                )}
              </For>
            </ToggleButtonGroup>
          </Box>

          <TextField
            label="Venue"
            value={props.details.venue}
            fullWidth
            size="small"
            onChange={e => props.onDetailUpdate({ ...props.details, venue: e.currentTarget.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LocationOn color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Description"
            value={props.details.description}
            fullWidth
            size="small"
            multiline
            minRows={3}
            onChange={e => props.onDetailUpdate({ ...props.details, description: e.currentTarget.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: "10px" }}>
                  <Notes color="action" fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>
  );
}
