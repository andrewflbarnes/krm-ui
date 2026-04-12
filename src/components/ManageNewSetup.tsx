import { Box, Card, CardContent, Divider, InputAdornment, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@suid/material"
import { LocationOn, Notes } from "@suid/icons-material"
import { For } from "solid-js"
import ManageNewSelect from "./ManageNewSelect"
import { ClubSeeding } from "../kings"

type Details = {
  description: string;
  venue: string;
  round: string;
}

type ComponentProps = {
  details: Details;
  onDetailUpdate: (details: Details) => void;
  config: ClubSeeding;
  onUpdate: (config: ClubSeeding) => void;
  onErrorUpdate?: (errors: string[]) => void;
}

const rounds = [1, 2, 3, 4]

export default function ManageNewSetup(props: ComponentProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 3,
        width: "100%",
        alignItems: "start",
      }}
    >
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

      <ManageNewSelect
        config={props.config}
        onUpdate={props.onUpdate}
        onErrorUpdate={props.onErrorUpdate}
      />
    </Box>
  )
}
