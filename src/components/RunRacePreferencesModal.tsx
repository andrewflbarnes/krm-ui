import { useFeatureFlags } from "@/hooks/flags";
import { usePreferences } from "@/hooks/preferences";
import { useKingsTheme } from "@/theme";
import { InfoOutlined } from "@suid/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Popover,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@suid/material";
import { ComponentProps, For, ParentProps, createEffect, createSignal } from "solid-js";

function ToolTip(props: ParentProps<{ title: string }>) {
  const [anchor, setAnchor] = createSignal<Element | null>(null);
  const [openTimeout, setOpenTimeout] = createSignal(null);
  const triggerOpen: ComponentProps<typeof Box>["onMouseEnter"] = (e) => {
    const target = e.currentTarget;
    setOpenTimeout(setTimeout(() => {
      setAnchor(target)
    }, 500));
  }
  const triggerClose = () => {
    clearTimeout(openTimeout());
    setAnchor(null);
  }
  const open = () => Boolean(anchor());
  createEffect(() => {
    return () => clearTimeout(openTimeout())
  })
  return (
    <>
      <Box
        sx={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
      >
        {props.children}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            ml: "-0.5em",
          }}
          onMouseEnter={triggerOpen}
          onMouseLeave={triggerClose}
          onClick={e => setAnchor(e.currentTarget)}
        >
          <InfoOutlined fontSize="small" sx={{ fontSize: 14 }} />
        </Box>
      </Box>
      <Popover
        open={open()}
        anchorEl={anchor()}
        onClose={triggerClose}
        sx={{ pointerEvents: "none" }}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Typography sx={{ p: 1.5, maxWidth: 260 }} variant="body2">
          {props.title}
        </Typography>
      </Popover>
    </>
  );
}

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
    fatFingers,
    switchFatFingers,
  } = usePreferences();

  const flags = useFeatureFlags();

  const {
    mode,
    setMode,
  } = useKingsTheme()


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
              <ToolTip title="Use icons instead of text for buttons and menus">
                <FormControlLabel
                  control={<Switch checked={!flags.verboseUi()} onChange={() => flags.setVerboseUi(v => !v)} />}
                  label="Simple UI"
                />
              </ToolTip>
              <FormControl size="small" fullWidth>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  Mode
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  size="small"
                  value={mode()}
                  onChange={(_, value) => value && setMode(value)}
                  color="primary"
                  fullWidth
                >
                  <For each={["dark", "light"] as const}>
                    {(m) => <ToggleButton value={m}>{m}</ToggleButton>}
                  </For>
                </ToggleButtonGroup>
              </FormControl>
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Minileague
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack>
              <ToolTip title="Collapses minileagues to take up less horizontal space">
                <FormControlLabel
                  control={<Switch checked={collapse()} onChange={switchCollapse} />}
                  label="Collapse"
                />
              </ToolTip>
              <ToolTip title="Display minileague team positions before all races are completed">
                <FormControlLabel
                  control={<Switch checked={live()} onChange={switchLive} />}
                  label="Live results"
                />
              </ToolTip>
            </Stack>
          </Box>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
              Race list
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <Stack>
              <ToolTip title="Break up mixed, ladies and board races">
                <FormControlLabel
                  control={<Switch checked={northern()} onChange={switchNorthern} />}
                  label="Northern style"
                />
              </ToolTip>
              <ToolTip title="If enabled, changing the winner of a race can only be done through the context menu">
                <FormControlLabel
                  control={<Switch checked={fatFingers()} onChange={switchFatFingers} />}
                  label="Fat fingers"
                />
              </ToolTip>
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
