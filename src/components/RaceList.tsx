import { Race } from "@/kings";
import { lazy, Show } from "solid-js";
const RaceListV1 = lazy(() => import("./RaceListV1"));
const RaceListV2 = lazy(() => import("./RaceListV2"));

type RaceListProps = {
  orderedRaces: Race[],
  onRaceUpdate: (race: Race) => void;
  listStyle?: "v1" | "v2";
  readonly?: boolean;
  knockout?: boolean;
  /** allows the winner to be changed when already set by just clicking the
      other team name i.e. without being force through the context menu */
  easyEdit?: boolean;
}

export default function RaceList(props: RaceListProps) {
  return (
    <Show
      fallback={<RaceListV1 {...props} />}
      when={props.listStyle === "v2"}
    >
      <RaceListV2 {...props} />
    </Show>
  )
}
