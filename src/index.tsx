/* @refresh reload */
import { render } from "solid-js/web";
import { A, Route, Router } from "@solidjs/router";
import { onMount, onCleanup, ParentProps } from "solid-js";
import { useTestContext, TestContextProvider } from "./ctx";

function Main(props: ParentProps<{ name: string }>) {
  onMount(() => console.log('mount', props.name, useTestContext()))
  onCleanup(() => console.log('cleanup', props.name))
  return (
    <div style={{ display: "flex", "flex-direction": "column" }}>
      {props.name}
      <A href="/">Home</A>
      <A href="/about">About</A>
      {props.children}
    </div>
  )
}

function About() { return <Main name="About" /> }
function Home() { return <Main name="Home" /> }

function App() {
  return (
    <div>
      <TestContextProvider>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
        </Router>
      </TestContextProvider>
    </div>
  )
}

render(() => <App />, document.getElementById("root")!);
