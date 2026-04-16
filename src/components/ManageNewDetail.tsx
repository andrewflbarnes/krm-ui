import { createMemo, createSignal, For, Show } from "solid-js";
import { Box, Card, CardContent, Divider, InputAdornment, MenuList, MenuItem, Paper, Popper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@suid/material";
import { LocationOn, Notes } from "@suid/icons-material";
import { useKings } from "../kings";

export type Details = {
  description: string;
  venue: string;
  round: string;
  season: string;
}

type ManageNewDetailProps = {
  details: Details;
  onDetailUpdate: (details: Details) => void;
}

export default function ManageNewDetail(props: ManageNewDetailProps) {
  const [k] = useKings();

  return (
    <Card
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

        <RoundSelect
          round={props.details.round}
          onRoundUpdate={round =>
            props.onDetailUpdate({ ...props.details, round })}
        />

        <Stack direction="row" spacing={2} alignItems="center">
          <LeagueSelect league={k.league()} />
          <SeasonSelect
            season={props.details.season}
            onSeasonUpdate={season =>
              props.onDetailUpdate({ ...props.details, season })}
          />
        </Stack>

        <VenueSelect
          venue={props.details.venue}
          venues={k.config().venues || []}
          onVenueUpdate={venue =>
            props.onDetailUpdate({ ...props.details, venue })}
        />

        <DescriptionInput
          description={props.details.description}
          onDescriptionUpdate={description =>
            props.onDetailUpdate({ ...props.details, description })}
        />
      </CardContent>
    </Card>
  );
}

const rounds = [1, 2, 3, 4]

function RoundSelect(props: { round: string, onRoundUpdate: (round: string) => void }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={2}>
        Round
      </Typography>
      <ToggleButtonGroup
        value={props.round}
        exclusive
        onChange={(_, value) => value && props.onRoundUpdate(value)}
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
  )
}

function LeagueSelect(props: { league: string }) {
  return (
    <TextField
      label="League"
      value={props.league}
      fullWidth
      size="small"
      disabled
      sx={{ "& .MuiInputBase-input": { textTransform: "capitalize" } }}
    />
  )
}

const seasonPattern = /^\d{2}\/\d{2}$/;

function SeasonSelect(props: { season: string, onSeasonUpdate: (season: string) => void }) {
  const seasonError = createMemo(() =>
    props.season.length > 0 && !seasonPattern.test(props.season)
  );

  return (
    <TextField
      label="Season"
      value={props.season}
      fullWidth
      size="small"
      placeholder="YY/YY"
      error={seasonError()}
      helperText={seasonError() ? "Format must be YY/YY" : undefined}
      onChange={e => props.onSeasonUpdate(e.currentTarget.value)}
    />
  )
}

function VenueSelect(props: {
  venue: string,
  venues: readonly string[],
  onVenueUpdate: (venue: string) => void,
}) {
  let venueAnchorRef!: HTMLDivElement;
  let searchRef!: HTMLDivElement;

  const [venueOpen, setVenueOpen] = createSignal(false);
  const [venueSearch, setVenueSearch] = createSignal("");
  const openVenue = () => {
    setVenueSearch("");
    setVenueOpen(true);
    setTimeout(() => searchRef?.querySelector<HTMLInputElement>("input")?.focus());
  };

  const venueOptions = createMemo(() => {
    const val = venueSearch().toLowerCase();
    if (!val) return props.venues;
    return props.venues.filter(v => v.toLowerCase().includes(val));
  });

  const customVenue = createMemo(() => {
    const val = venueSearch().trim();
    if (!val) return null;
    return props.venues.some(v => v.toLowerCase() === val.toLowerCase()) ? null : val;
  });

  const selectVenue = (venue: string) => {
    props.onVenueUpdate(venue);
    setVenueOpen(false);
  };

  return (
    <>
      <div ref={venueAnchorRef}>
        <TextField
          label="Venue"
          value={props.venue}
          fullWidth
          size="small"
          onClick={openVenue}
          inputProps={{ readOnly: true, style: { cursor: "pointer" } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOn color="action" fontSize="small" />
              </InputAdornment>
            ),
            sx: { cursor: "pointer" },
          }}
        />
      </div>
      <Popper
        open={venueOpen()}
        anchorEl={() => venueAnchorRef}
        placement="bottom-start"
        style={{ "z-index": 1300 }}
        modifiers={[{
          name: "sameWidth",
          enabled: true,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: ({ state }) => { state.styles.popper.width = `${state.rects.reference.width}px`; },
          effect: ({ state }) => { (state.elements.popper as HTMLElement).style.width = `${(state.elements.reference as HTMLElement).getBoundingClientRect().width}px`; },
        }]}
      >
        <Paper elevation={3}>
          <div ref={searchRef} style={{ padding: "8px" }}>
            <TextField
              placeholder="Search venues…"
              value={venueSearch()}
              size="small"
              fullWidth
              onChange={e => setVenueSearch(e.currentTarget.value)}
              onBlur={() => setVenueOpen(false)}
            />
          </div>
          <MenuList dense>
            <For each={venueOptions()}>
              {(v) => (
                <MenuItem onMouseDown={() => selectVenue(v)}>
                  {v}
                </MenuItem>
              )}
            </For>
            <Show when={customVenue()}>
              {(custom) => (
                <MenuItem onMouseDown={() => selectVenue(custom())}>
                  Use "{custom()}"
                </MenuItem>
              )}
            </Show>
          </MenuList>
        </Paper>
      </Popper>
    </>
  )
}

function DescriptionInput(props: { description: string, onDescriptionUpdate: (desc: string) => void }) {
  return (
    <TextField
      label="Description"
      value={props.description}
      fullWidth
      size="small"
      multiline
      minRows={3}
      onChange={e => props.onDescriptionUpdate(e.currentTarget.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: "10px" }}>
            <Notes color="action" fontSize="small" />
          </InputAdornment>
        ),
      }}
    />
  )
}
