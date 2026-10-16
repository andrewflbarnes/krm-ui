import { useAtom } from "solid-jotai";
import { atomWithStorage, createJSONStorage } from "solid-jotai/utils";

export const defaultStorage = <T>() => createJSONStorage<T>(() => localStorage);

// atomWithStorage only saves to storage when the value changes, so we need to
// manually set it on init if it's present in the query params if we want it to
// persist across reloads.

const initialSearchParams = new URLSearchParams(window.location.search);

export function initialisableAtomWithStorage<T>(
  storageKey: string,
  defaultValue: T,
  override?: T,
) {
  const atom = atomWithStorage(
    storageKey,
    override,
    defaultStorage<T>(),
    { getOnInit: !override },
  );
  let saved = false
  return () => {
    const [value, setValue] = useAtom(atom);
    if (!saved) {
      if (override) {
        // use initialising value if present
        setValue(override)
      } else if (!value() && defaultValue) {
        // use the default value if no value is present in storage
        setValue(defaultValue)
      }
    }
    saved = true
    return [value, setValue] as const
  }
}

export function flagAtomWithStorage(
  storageKey: string,
  queryParamKey: string | null,
) {
  const queryParam = queryParamKey ? initialSearchParams.get(queryParamKey) : null
  const atom = atomWithStorage(
    storageKey,
    queryParam === "true",
    defaultStorage<boolean>(),
    { getOnInit: !queryParam },
  );
  let saved = false
  return () => {
    const [value, setValue] = useAtom(atom);
    if (!saved && queryParam !== null) {
      setValue(queryParam === "true");
    }
    saved = true
    return [value, setValue] as const
  }
}


