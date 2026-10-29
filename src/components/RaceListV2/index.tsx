import { createEffect, createSelector, createSignal, Index, onMount, Show } from "solid-js";
import { Race } from "@/kings";
import styles from "./RaceListV2.module.css";
import { useIncrementalLoader } from "@/hooks/incremental-loader";
import RowHeader from "./RowHeader";
import RowRace from "./RowRace";
import RowTeamInfo from "./RowTeamInfo";
import RowTeamActions from "./RowTeamActions";

type RaceListV2Props = {
  orderedRaces: Race[],
  onRaceUpdate: (race: Race) => void;
  readonly?: boolean;
  knockout?: boolean;
}

function raceInfoString(race: Race): string {
  if (race.stage === "knockout") {
    return `${race.division.capitalize()} knockout`
  }
  return `Group ${race.group}`
    + ` team ${race.teamMlIndices[0] + 1}`
    + " vs "
    + `team ${race.teamMlIndices[1] + 1}`
}

export default function RaceListV2(props: RaceListV2Props) {
  const [openRace, setOpenRace] = createSignal<number | null>(null)
  const isOpenRace = createSelector(openRace)

  const [raceSlice, startLoad] = useIncrementalLoader(() => props.orderedRaces)
  onMount(startLoad)
  createEffect(startLoad)
  return (
    <div style={{
      "padding-top": 0,
      width: "30em", // todo something more sensible/responsive/absolute
    }}>
      <table style={{ width: "100%", "border-collapse": "collapse" }}>
        <Index each={raceSlice()}>{(race, raceNum) => {
          // Use Index instead of For to prevent unnecessary unmount + mount
          // when all ordered races changes as a result of a single race
          // being updated.
          // For now updating a race results in the entire round being
          // treated as a brand new object
          const handleRaceUpdate = (updated: Partial<Race>) => {
            props.onRaceUpdate({
              ...race(),
              ...updated,
            })
          }
          return (
            <RaceTableV2Row
              raceNum={raceNum}
              raceStr={props.knockout ? race().group : null}
              race={race()}
              onRaceUpdate={handleRaceUpdate}
              readonly={props.readonly}
              open={isOpenRace(raceNum)}
              onOpen={() => setOpenRace(prev => prev == raceNum ? null : raceNum)}
            />
          )
        }}</Index>
      </table>
    </div>
  )
}

type RaceTableV2RowProps = {
  raceNum: number;
  raceStr?: string;
  race: Race;
  onRaceUpdate: (race: Partial<Race>) => void;
  readonly?: boolean;
  open?: boolean;
  onOpen: () => void;
}

function RaceTableV2Row(props: RaceTableV2RowProps) {
  const handleSetWinner = (winner: 1 | 2) => {
    if (props.readonly) {
      props.onOpen()
      return
    }
    if (props.race.winner) {
      props.onOpen()
      return
    }
    props.onRaceUpdate({ winner })
  }

  const handleOpen = () => {
    props.onOpen()
  }

  return (
    <>
      <Show when={props.readonly}>
        <ExpandableGap open={!!props.open} />
      </Show>
      <Show when={!props.readonly}>
        <RowHeader
          race={props.race}
          open={!!props.open}
          detailStr={raceInfoString(props.race)}
          onClick={handleOpen}
          readonly={props.readonly}
          raceStr={props.raceStr}
        />
      </Show>
      <RowRace
        race={props.race}
        onClick={handleOpen}
        onSetWinner={handleSetWinner}
        open={!!props.open}
        readonly={props.readonly}
        raceStr={props.raceStr}
      />
      <Show when={props.readonly}>
        <RowTeamInfo
          race={props.race}
          open={!!props.open}
          onClick={handleOpen}
          detailStr={raceInfoString(props.race)}
        />
      </Show>
      <Show when={!props.readonly}>
        <RowTeamActions
          race={props.race}
          open={!!props.open}
          readonly={props.readonly}
          onRaceUpdate={props.onRaceUpdate}
        />
      </Show>
      <ExpandableGap open={!props.readonly || !!props.open} />
    </>
  )
}

function ExpandableGap(props: { open: boolean }) {
  return (
    <tr class={styles.raceInfoExpand}>
      <td colspan="100%">
        <div style={{
          transition: "height 0.2s ease",
          transform: props.open ? "scaleY(1)" : "scaleY(0)",
          height: props.open ? "8px" : "0px",
        }} />
      </td>
    </tr>
  )
}
