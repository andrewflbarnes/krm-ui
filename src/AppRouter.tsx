import { Route, Router } from "@solidjs/router";
import AppLayout from "./AppLayout";
import Home from "./pages/Home";
import RaceManager from "./pages/RaceManager";
import RaceManagerRoot from "./pages/RaceManagerRoot";
import RaceManagerRound from "./pages/RaceManagerRound";
import LeagueManager from "./pages/LeagueManager";
import ResultsView from "./pages/ResultsView";
import Portal from "./pages/Portal";

export default function App() {
  return (
    <Router root={AppLayout}>
      <Route path="/" component={Home} />
      <Route path="/race" component={RaceManager} info={{ breadcrumb: "Race" }}>
        <Route path="/" component={RaceManagerRoot} />
        <Route path="/:round" component={RaceManagerRound} info={{ breadcrumb: "Round" }} />
      </Route>
      <Route path="/league" component={LeagueManager} info={{ breadcrumb: "League" }} />
      <Route path="/results" component={ResultsView} info={{ breadcrumb: "Results" }} />
      <Route path="/portal" component={Portal} info={{ breadcrumb: "Portal" }} />
    </Router>
  )
}

