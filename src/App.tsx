import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./kings";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import RaceManager from "./pages/RaceManager";
import RaceManagerRoot from "./pages/RaceManagerRoot";
import RaceManagerRound from "./pages/RaceManagerRound";
import LeagueManager from "./pages/LeagueManager";
import ResultsView from "./pages/ResultsView";
import Portal from "./pages/Portal";
import Status404 from "./pages/Status404";
import AppLayout from "./AppLayout";
import { ParentProps } from "solid-js";

const queryClient = new QueryClient()

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
    }}>
      <Router root={HydratedAppLayout}>
        <Route path="/" component={Home} />
        <Route path="/race" component={RaceManager} info={{ breadcrumb: "Race" }}>
          <Route path="/" component={RaceManagerRoot} />
          <Route path="/:round" component={RaceManagerRound} info={{ breadcrumb: "Round" }} />
        </Route>
        <Route path="/league" component={LeagueManager} info={{ breadcrumb: "League" }} />
        <Route path="/results" component={ResultsView} info={{ breadcrumb: "Results" }} />
        <Route path="/portal" component={Portal} info={{ breadcrumb: "Portal" }} />
        <Route path="*404" component={Status404} info={{ breadcrumb: "OOPS!" }} />
      </Router>
    </div >
  )
}

function HydratedAppLayout(props: ParentProps<{}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <BreadcrumberProvider>
        <KingsProvider>
          <AppLayout>
            {props.children}
          </AppLayout>
        </KingsProvider>
      </BreadcrumberProvider>
    </QueryClientProvider>
  )
}
