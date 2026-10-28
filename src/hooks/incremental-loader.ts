import { Accessor, createMemo, createSignal } from "solid-js"

// incremental load for better UX
// Why? solidjs absolutely chokes when rendering even a moderate number of rows
// at once, especially when mui is incorporated, particulary with sx because of
// sx props.
// The incremental load spreads this rendering time out so we the first few rows
// render "immediately".
// One mounted the UI is actually fine.
export function useIncrementalLoader<T>(
  items: Accessor<T[]>,
  timeout: number = 1,
): [Accessor<T[]>, () => void] {
  const [loaded, setLoaded] = createSignal(0)

  let interval: NodeJS.Timeout
  function startIncrementalLoad(length: number) {
    return setInterval(() => {
      setLoaded(prev => {
        if (prev < length) {
          return prev + 1
        } else {
          clearInterval(interval)
          return length
        }
      })
    }, timeout)
  }

  const start = () => {
    if (interval) {
      clearInterval(interval)
    }
    interval = startIncrementalLoad(items().length)
  }

  const slice = createMemo(() => items().slice(0, loaded()))

  return [slice, start] as const
}
