import { useFeatureFlags } from "@/hooks/flags";
import { usePreferences } from "@/hooks/preferences";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@suid/material";
import { For } from "solid-js";

export default function RunRacePreferencesModal(props: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    live,
    switchLive,
    collapse,
    switchCollapse,
    northern,
    switchNorthern,
    listStyle,
    setListStyle,
  } = usePreferences();

  const flags = useFeatureFlags();

  return (
    <Dialog onClose={props.onClose} open={props.open} fullWidth maxWidth="xs">
      <DialogTitle>Preferences</DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Display
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack>
              <FormControlLabel
                control={<Switch checked={!flags.verboseUi()} onChange={() => flags.setVerboseUi(v => !v)} />}
                label="Simple UI"
              />
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Minileague
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack>
              <FormControlLabel
                control={<Switch checked={collapse()} onChange={switchCollapse} />}
                label="Collapse"
              />
              <FormControlLabel
                control={<Switch checked={live()} onChange={switchLive} />}
                label="Live results"
              />
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Race list
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack gap={1.5}>
              <FormControlLabel
                control={<Switch checked={northern()} onChange={switchNorthern} />}
                label="Northern style"
              />
              <FormControl size="small" fullWidth>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  List style
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={listStyle()}
                  onChange={(_, value) => value && setListStyle(value)}
                  color="primary"
                  fullWidth
                >
                  <For each={["v1", "v2"] as const}>
                    {(view) => <ToggleButton value={view}>{view}</ToggleButton>}
                  </For>
                </ToggleButtonGroup>
              </FormControl>
            </Stack>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
