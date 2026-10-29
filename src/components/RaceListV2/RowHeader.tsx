import { Race } from "@/kings";
import { Card, Typography } from "@suid/material";
import CellStatusIndicator from "./CellStatusIndicator";
import NumberBadge from "@/ui/NumberBadge";
import { ExpandLess } from "@suid/icons-material";
import styles from "./RaceListV2.module.css";

export default function RowHeader(props: {
  race: Race;
  open: boolean;
  detailStr: string;
  onClick: () => void;
  readonly?: boolean;
  raceStr?: string;
}) {
  return (
    <Card
      data-testid={`race-${props.race.stage}-${props.race.division}-${props.race.group}-${props.race.groupRace}`}
      onClick={props.onClick}
      class={`${styles.raceInfoTop} ${styles.fadeIn}`}
      sx={{
        cursor: props.readonly ? "inherit" : "pointer",
        boxShadow: "none",
      }}
    >
      <CellStatusIndicator complete={!!props.race.winner} />
      <td colspan="100%">
        <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", "justify-content": "space-between", gap: "1em" }}>
          <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", gap: "0.5em" }}>
            <NumberBadge value={props.race.division[0].toUpperCase()} bgcolor={props.race.division} />
            <Typography align="left" variant="caption" color="text.secondary">
              Race {props.race.raceNumber}{props.raceStr ? ` - ${props.raceStr}` : ""}
            </Typography>
          </div>
          <div style={{ display: "flex", "flex-direction": "row", "align-items": "center", gap: "0.5em" }}>
            <Typography align="left" variant="caption" color="text.secondary">
              {props.detailStr}
            </Typography>
            <ExpandLess fontSize="small" sx={{
              transform: props.open ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.2s ease",
              display: props.readonly ? "none" : "inherit",
            }} />
          </div>
        </div>
      </td>
    </Card>
  )
}
