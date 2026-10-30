import { useFeatureFlags } from "@/hooks/flags";
import { JSX, ParentProps, Show } from "solid-js";

/**
  * A lightweight component for syncing simple and verbose UI modes.
  */
export default function SimpleUi(props: ParentProps<{
  verbose: JSX.Element
}>) {
  const flags = useFeatureFlags()
  return (
    <Show
      fallback={props.verbose}
      when={!flags.verboseUi()}
    >
      {props.children}
    </Show>
  )
}
