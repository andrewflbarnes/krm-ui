import { ParentProps } from "solid-js";

export default function RaceManager(props: ParentProps<{}>) {
  return (
    <div>
      <h2>Race Manager</h2>
      {props.children}
    </div>
  )
}

