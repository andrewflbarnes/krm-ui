import { Show } from "solid-js";
import { Box, useMediaQuery, useTheme } from "@suid/material"
import RaceNewSelect from "@/components/RaceNewSelect"
import { ClubSeeding, Division, RoundOptions } from "@/kings"
import RaceNewDetail from "@/components/RaceNewDetail"
import RaceNewSelectFooter from "@/components/RaceNewSelectFooter";
import { RoundDetails } from "@/kings/engine";

type ComponentProps = {
  details: RoundDetails;
  onDetailUpdate: (details: RoundDetails) => void;
  options: RoundOptions;
  onOptionsUpdate: (options: RoundOptions) => void;
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, num: number) => void;
  onErrorUpdate?: (errors: string[]) => void;
}

export default function RaceNewSetup(props: ComponentProps) {
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
        <RaceNewDetail
          details={props.details}
          onDetailUpdate={props.onDetailUpdate}
          options={props.options}
          onOptionsUpdate={props.onOptionsUpdate}
        />

        <Show when={small()}>
          <Box sx={{
            mt: 2,
          }}>
            <RaceNewSelect
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
            <RaceNewSelect
              config={props.config}
              onUpdate={props.onUpdate}
              onErrorUpdate={props.onErrorUpdate}
            />
          </Box>
        </Show>

        <RaceNewSelectFooter
          config={props.config}
          onUpdate={props.onUpdate}
          onErrorUpdate={props.onErrorUpdate}
        />

      </Box>
    </Box>
  )
}
