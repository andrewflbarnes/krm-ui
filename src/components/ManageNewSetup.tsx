import { batch, createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { Box, Chip, Divider, IconButton, InputAdornment, Paper, Stack, TextField, Typography, useMediaQuery, useTheme } from "@suid/material"
import ManageNewSelect from "./ManageNewSelect"
import { ClubSeeding, Division, divisions, raceConfig } from "../kings"
import ManageNewDetail, { Details } from "./ManageNewDetail"
import { DIVISION_ACCENT } from "../theme";
import PopoverButton from "../ui/PopoverButton";
import { Add, ErrorOutlineRounded } from "@suid/icons-material";
import ManageNewSelectFooter from "./ManageNewSelectFooter";

type ComponentProps = {
  details: Details;
  onDetailUpdate: (details: Details) => void;
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, num: number) => void;
  onErrorUpdate?: (errors: string[]) => void;
}

export default function ManageNewSetup(props: ComponentProps) {
  const theme = useTheme();
  const small = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box
      sx={{
        display: {
          xs: "flex",
          md: "grid",
        },
        flexDirection: "column",
        gridTemplateColumns: "1fr 1fr",
        gap: 2,
        width: "100%",
        height: "100%",
        alignItems: "start",
      }}
    >

      <Box sx={{
        flexGrow: 1,
        overflow: "scroll",
        width: "100%",
      }}>
        <ManageNewDetail
          details={props.details}
          onDetailUpdate={props.onDetailUpdate}
        />

        <Show when={small()}>
          <Box sx={{
            mt: 2,
          }}>
            <ManageNewSelect
              config={props.config}
              onUpdate={props.onUpdate}
              onErrorUpdate={props.onErrorUpdate}
            />
          </Box>
        </Show>
      </Box>

      <Box sx={{
        width: "100%",
        height: {
          md: "100%"
        },
        display: "flex",
        flexDirection: "column",
        gap: 2,
        overflow: {
          md: "auto"
        },
      }}>
        <Show when={!small()}>
          <Box sx={{
            flexGrow: 1,
            overflow: "scroll",
          }}>
            <ManageNewSelect
              config={props.config}
              onUpdate={props.onUpdate}
              onErrorUpdate={props.onErrorUpdate}
            />
          </Box>
        </Show>

        <ManageNewSelectFooter
          config={props.config}
          onUpdate={props.onUpdate}
          onErrorUpdate={props.onErrorUpdate}
        />

      </Box>
    </Box>
  )
}
