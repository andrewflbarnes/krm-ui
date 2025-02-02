import { ErrorBoundary, FlowProps } from "solid-js";

/**
  * NOTE: This boundary won't re-render if a prop in the child changes - you will
  * need to wrap this with a keyed Match or Show or an equivalent mechanism to
  * force a re-render
  */
export default function BasicErrorBoundary(props: FlowProps<{ message?: string }>) {
  return (
    <ErrorBoundary fallback={e => {
      console.error(e)
      return (
        <>
          <div>
            Something went wrong{props.message ? ` - ${props.message}` : ""} :(
          </div>
          <div>
            {e.message}
          </div>
        </>
      )
    }}>
      {props.children}
    </ErrorBoundary>
  )
}
