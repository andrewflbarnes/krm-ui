import { useAtom } from "solid-jotai";
import { atomWithStorage } from "solid-jotai/utils";

// atomWithStorage only saves to storage when the value changes, so we need to
// manually set it on init if it's present in the query params if we want it to
// persist across reloads.

const initialSearchParams = new URLSearchParams(window.location.search);

export function flagAtomWithStorage(
  storageKey: string,
  queryParamKey: string | null,
) {
  const queryParam = queryParamKey ? initialSearchParams.get(queryParamKey) : null
  const atom = atomWithStorage(
    storageKey,
    queryParam === "true",
    undefined,
    { getOnInit: !queryParam },
  );
  let saved = false
  return () => {
    const [value, setValue] = useAtom(atom);
    if (!saved && queryParam !== null) {
      setValue(queryParam === "true");
      saved = true
    }
    return [value, setValue] as const
  }
}


