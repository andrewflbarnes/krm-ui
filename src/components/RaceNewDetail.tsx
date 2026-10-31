import { createMemo, createSignal, For, JSX, Show } from "solid-js";
import { Box, Card, CardContent, InputAdornment, MenuList, MenuItem, Paper, Popper, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography, useTheme, useMediaQuery, CardHeader, Divider, FormControl, Dialog, DialogTitle, DialogContent, IconButton } from "@suid/material";
import { InfoOutlined, LocationOn, Notes } from "@suid/icons-material";
import { useKings } from "@/hooks/kings";
import ExpandMoreLess from "@/ui/ExpandMoreLess";
import { Collapse } from "solid-collapse";
import styles from "@/components/RaceNewDetail.module.css";
import { RoundDetails } from "@/kings/engine";
import { useFeatureFlags } from "@/hooks/flags";
import { ConflictResolution, RoundOptions } from "@/kings";

type RaceNewDetailProps = {
  details: RoundDetails;
  onDetailUpdate: (details: RoundDetails) => void;
  options: RoundOptions;
  onOptionsUpdate: (options: RoundOptions) => void;
}

export default function RaceNewDetail(props: RaceNewDetailProps) {
  const [k] = useKings();
  const [showDetails, setShowDetails] = createSignal(true);

  return (
    <Card
      sx={{
        borderRadius: 2,
      }}
    >
      <CardHeader
        title="Round Details"
        action={
          <Box sx={{
            display: {
              xs: "block",
              md: "noni",
            }
          }}>
            <ExpandMoreLess
              expand={showDetails()}
              onClick={() => setShowDetails(expanded => !expanded)}
            />
          </Box>
        }
      />
      <Collapse value={showDetails()} class={styles.detailcollapse}>
        <CardContent>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
          >
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

            <Options
              options={props.options}
              onOptionsUpdate={options =>
                props.onOptionsUpdate(options)}
            />
          </Box>
        </CardContent>
      </Collapse>
    </Card>
  );
}

const rounds = [1, 2, 3, 4] as const

function RoundSelect(props: { round: string, onRoundUpdate: (round: string) => void }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={2}>
        Round
      </Typography>
      <ToggleButtonGroup
        value={props.round}
        exclusive
        color="primary"
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
  let venueAnchorRef!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars
  let searchRef!: HTMLDivElement; // oxlint-disable-line no-unassigned-vars

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
                <LocationOn fontSize="small" />
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

const optionsConflict: ConflictResolution[] = ["manual", "high", "low"] as const

function Options(props: {
  options: RoundOptions;
  onOptionsUpdate: (options: RoundOptions) => void;
}) {
  const flags = useFeatureFlags()
  const [optionInfo, setOptionInfo] = createSignal<{
    title: string;
    info: JSX.Element;
  }>()

  return (
    <Show when={flags.experimental()}>
      <Dialog
        open={!!optionInfo()}
        onClose={() => setOptionInfo(undefined)}
        maxWidth="xs"
      >
        <DialogTitle>
          {optionInfo()?.title}
        </DialogTitle>
        <DialogContent>
          {optionInfo()?.info}
        </DialogContent>
      </Dialog>
      <Box>
        <Typography variant="overline" color="text.secondary" fontWeight={600} letterSpacing={2}>
          Options
        </Typography>
        <Divider sx={{ mb: 1 }} />
        <Stack gap={1.5}>
          <FormControl size="small" fullWidth>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              <div style={{ display: "flex", "align-items": "center" }}>
                <div>
                  Draw Resolution
                </div>
                <IconButton
                  size="small"
                  onClick={() => setOptionInfo({
                    title: "Draw Resolution",
                    info: (
                      <Typography variant="body2">
                        <span
                          style={{ display: "block", "margin-bottom": "1em" }}
                        >
                          This option determines how the system resolves draws in races. The available options are:
                        </span>
                        <div style={{
                          display: "grid",
                          "grid-template-columns": "auto auto",
                          gap: "0.5em",
                        }}
                        >
                          <div><strong>Manual:</strong></div>
                          <div>Draws must be resolved manually by the user.</div>
                          <div><strong>High:</strong></div>
                          <div>Automatically resolve draws by making the highest seed the winner.</div>
                          <div><strong>Low:</strong></div>
                          <div>Automatically resolve draws by making the lowest seed the loser</div>
                        </div>
                      </Typography>
                    )
                  })}>
                  <InfoOutlined fontSize="small" />
                </IconButton>
              </div>
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              value={props.options.conflictResolution}
              onChange={(_, value) => value && props.onOptionsUpdate({
                ...props.options,
                conflictResolution: value
              })}
              color="standard"
              fullWidth
            >
              <For each={optionsConflict}>
                {(o) => <ToggleButton value={o}>{o.capitalize()}</ToggleButton>}
              </For>
            </ToggleButtonGroup>
          </FormControl>
        </Stack>
      </Box>
    </Show>
  )
}

function DescriptionInput(props: { description: string, onDescriptionUpdate: (desc: string) => void }) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <TextField
      label="Description"
      value={props.description}
      fullWidth
      size="small"
      multiline
      minRows={small() ? 1 : 3}
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
