import { Box, Card, CardContent, Chip, Stack, Typography } from "@suid/material"
import { For } from "solid-js"
import { ClubSeeding, Division, divisions } from "../kings"
import NumberField from "../ui/NumberField"

type ComponentProps = {
  config: ClubSeeding;
  onUpdate: (club: string, division: Division, num: number) => void;
  onErrorUpdate?: (errors: string[]) => void;
};

export default function ManageNewSelect(props: ComponentProps) {
  const clubs = () => Object.keys(props.config).sort((a, b) => a.localeCompare(b));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 0.5,
        }}
      >
        <For each={clubs()}>{(club) => {
          const teams = () => props.config[club];
          const clubTotal = () => teams().mixed + teams().ladies + teams().board;
          return (
            <Card data-testid={`club-${club}`}>
              <CardContent sx={{ py: "6px !important", px: "12px !important" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="caption" fontWeight="bold" sx={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {club}
                  </Typography>
                  <For each={divisions}>{(division) => (
                    <Stack alignItems="center" spacing={0}>
                      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.1, fontSize: "0.6rem" }}>
                        {division.charAt(0).toUpperCase()}
                      </Typography>
                      <Box sx={{ width: "40px" }}>
                        <NumberField
                          onChange={(e) =>
                            props.onUpdate(club, division, +e.target.value >>> 0)
                          }
                          value={teams()[division]}
                          zeroBlank
                        />
                      </Box>
                    </Stack>
                  )}</For>
                  <Chip
                    label={clubTotal()}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: "0.65rem",
                      width: 32,
                      "& .MuiChip-label": {
                        px: 0, textAlign: "center"
                      }
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>
          )
        }}</For>
      </Box>
    </Box>
  )
}
