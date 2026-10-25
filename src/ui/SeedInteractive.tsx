import { Box, Theme } from "@suid/material";
import { JSX } from "solid-js";
import { Division } from "../kings";
import Seed from "../ui/Seed";

export default function SeedInteractive(props: {
  team: string;
  seed: string | number;
  division: Division;
  disabled?: boolean;
  defocus?: boolean;
  highlight?: boolean;
  startAdornment?: JSX.Element;
  endAdornment?: JSX.Element;
}) {
  return (
    <Box sx={{
      display: "flex",
      alignItems: "center",
      gap: 1,
      px: 0.5,
      py: 0.5,
      opacity: props.defocus ? 0.5 : 1,
      borderRadius: 1,
      transition: "box-shadow 0.15s ease, background-color 0.15s ease, transform 0.12s ease",
      boxShadow: props.highlight
        ? (theme: Theme) => `0 0 0 2px ${theme.palette.primary.main}, 0 4px 16px ${theme.palette.primary.main}40`
        : "none",
      bgcolor: props.highlight ? "action.selected" : "transparent",
      transform: props.highlight ? "scale(1.015)" : "scale(1)",
    }}>
      {props.startAdornment}
      <Seed team={props.team} accent={props.division} num={props.seed} />
      {props.endAdornment}
    </Box>
  )
}
