import Stack from "@suid/material/Stack";
import { createEffect, createSignal, Index, onMount } from "solid-js";
import { GroupRaces, Race } from "@/kings";
import MiniLeague from "@/components/MiniLeague";
import { useIncrementalLoader } from "@/hooks/incremental-loader";
import styles from "@/components/MiniLeagues.module.css";

type MiniLeaguesProps = {
  readonly: boolean;
  collapse: boolean;
  live: boolean;
  races: {
    division: string;
    groups: {
      group: string;
      races: GroupRaces;
    }[]
  }[];
  onRaceUpdate: (race: Race) => void;
}

export default function MiniLeagues(props: MiniLeaguesProps) {
  const [divisionLoaded, setDivisionLoaded] = createSignal(1)
  let ref!: HTMLDivElement // oxlint-disable-line no-unassigned-vars
  return (
    <Stack
      gap={2}
      width="100%"
      ref={ref}
    >
      <Index each={props.races.slice(0, divisionLoaded())}>{(races) => {
        const division = () => races().division
        const [raceSlice, startLoad] = useIncrementalLoader(() => races().groups)
        createEffect(() => {
          if (raceSlice().length == races().groups.length) {
            setDivisionLoaded(prev => prev + 1)
          }
        })
        onMount(startLoad)
        createEffect(startLoad)
        // animations mess up internal ref positions for the context menu so
        // pass in some wrapping ref to override
        return (
          <Index each={raceSlice()}>{(group) => (
            <div
              class={styles.fadeIn}
            >
              <MiniLeague
                contextRef={ref}
                live={props.live}
                collapsed={props.collapse}
                name={division().capitalize() + " " + group().group}
                races={group().races.races}
                teams={group().races.teams}
                conflict={group().races.conflict}
                onResultChange={props.onRaceUpdate}
                readonly={props.readonly}
              />
            </div>
          )}</Index>
        )
      }}</Index>
    </Stack>
  )
}
