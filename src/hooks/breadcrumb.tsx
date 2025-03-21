import { useCurrentMatches } from "@solidjs/router"
import { Accessor, createContext, createEffect, ParentProps, useContext } from "solid-js"
import { createStore } from "solid-js/store"

export type BreadcrumberContextState = {
  readonly overrides: Record<string, string>
}

export type BreadcrumberContextValue = [
  state: BreadcrumberContextState,
  actions: {
    override: (key: string, value: string) => void
  }
]

const BreadcrumberContext = createContext<BreadcrumberContextValue>([{
  overrides: {},
}, {
  override: () => { },
}])

export function BreadcrumberProvider(props: ParentProps) {
  const [state, setState] = createStore<BreadcrumberContextState>({
    overrides: {},
  })
  const override = (key: string, value: string) => {
    setState("overrides", key, value)
  }

  return (
    <BreadcrumberContext.Provider value={[state, { override }]}>
      {props.children}
    </BreadcrumberContext.Provider>
  )
}

export function useBreadcrumber() {
  return useContext(BreadcrumberContext)
}

export function useBreadcrumberUpdate(value: string | Accessor<string>, repl?: string) {
  const [, { override }] = useBreadcrumber()
  const matches = useCurrentMatches()
  createEffect(() => {
    const v = typeof value === "function" ? value() : value
    if (!v) {
      return
    }
    if (repl) {
      override(repl, v)
      return
    }
    const m = matches()
    if (m.length < 1) {
      return
    }
    const breadcrumb = m[m.length - 1].route.info?.breadcrumb
    if (breadcrumb?.length) {
      override(breadcrumb, v)
    }
  })

}
