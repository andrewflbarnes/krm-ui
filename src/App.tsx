import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./kings";
import { Route, Router } from "@solidjs/router";
import { createMemo, createSignal, lazy, ParentProps } from "solid-js";
import { createPalette, createTheme, ThemeProvider } from "@suid/material";
import AppLayout from "./AppLayout";
const Home = lazy(() => import("./pages/Home"));
const Config = lazy(() => import("./pages/Config"));
const ConfigMiniLeague = lazy(() => import("./pages/ConfigMiniLeague"));
const ConfigRound = lazy(() => import("./pages/ConfigRound"));
const ConfigRoundCreate = lazy(() => import("./pages/ConfigRoundCreate"));
const Developer = lazy(() => import("./pages/Developer"));
const TeamConfig = lazy(() => import("./pages/TeamConfig"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Portal = lazy(() => import("./pages/Portal"));
const RaceManagerContinue = lazy(() => import("./pages/ManageContinue"));
const RaceManagerNew = lazy(() => import("./pages/ManageNew"));
const RunRaceAbandoned = lazy(() => import("./pages/RunRaceAbandoned"));
const RunRaceInProgress = lazy(() => import("./pages/RunRaceInProgress"));
const RunRaceRedirect = lazy(() => import("./pages/RunRaceRedirect"));
const RunRace = lazy(() => import("./pages/RunRace"));
const Status404 = lazy(() => import("./pages/Status404"));
import { Toaster } from "solid-toast";
import "./utils/stringutils";
import { AuthProvider } from "./hooks/auth";

const queryClient = new QueryClient()

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
    }}>
      <Toaster position="bottom-right" />
      <Router base={`${import.meta.env.BASE_URL}`} root={HydratedAppLayout}>
        {/* home */}
        <Route path="/" component={Home} />
        {/* teams */}
        <Route path="/teams" component={TeamConfig} info={{ breadcrumb: "Teams" }} />
        {/* config */}
        <Route path="/config" component={Config} info={{ breadcrumb: "Config" }}>
          <Route path="/" />
          <Route path="/tracker" component={Tracker} info={{ breadcrumb: "Tracker" }} />
          <Route path="/minileague" component={ConfigMiniLeague} info={{ breadcrumb: "ML" }}>
            <Route path="/:ml?" />
          </Route>
          <Route path="/round/create" component={ConfigRoundCreate} />
          <Route path="/round" component={ConfigRound} info={{ breadcrumb: "Round" }}>
            <Route path="/:round?" />
          </Route>
          <Route path="/portal" component={Portal} info={{ breadcrumb: "Portal" }} />
        </Route>
        {/* races */}
        <Route path="/races" info={{ breadcrumb: "Race", breadcrumbTo: "/manage/continue" }}>
          <Route path="/" component={RaceManagerContinue} />
          <Route path="/new" component={RaceManagerNew} info={{ breadcrumb: "New" }} />
          <Route path="/:raceid" component={RunRace}>
            <Route path="/" component={RunRaceRedirect} />
            <Route path="/abandoned" component={RunRaceAbandoned} info={{ breadcrumb: "Abandoned" }} />
            <Route path="/:stage" component={RunRaceInProgress} info={{ breadcrumb: "Stage" }} />
          </Route>
        </Route>
        {/* developer tools */}
        <Route path="/dev" component={Developer} info={{ breadcrumb: "Developer" }}>
          <Route path="/:devview?" />
        </Route>
        {/* 404 fallback */}
        <Route path="*404" component={Status404} info={{ breadcrumb: "OOPS!" }} />
      </Router>
    </div >
  )
}

function HydratedAppLayout(props: ParentProps) {
  const savedMode = (function() {
    const m = localStorage.getItem("theme-mode")
    switch (m) {
      case "light":
      case "dark":
        return m
      default:
        localStorage.setItem("theme-mode", "dark")
        return "dark"
    }
  })()

  const [mode, setMode] = createSignal<"light" | "dark">(savedMode);

  const palette = createMemo(() => {
    return createPalette({ mode: mode() });
  });

  const theme = createTheme({ palette: palette });

  const handleModeChange = () => setMode(m => {
    const newMode = m === "light" ? "dark" : "light"
    localStorage.setItem("theme-mode", newMode)
    return newMode
  })
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BreadcrumberProvider>
          <KingsProvider>
            <ThemeProvider theme={theme}>
              <AppLayout onModeChange={handleModeChange}>
                {props.children}
              </AppLayout>
            </ThemeProvider>
          </KingsProvider>
        </BreadcrumberProvider>
      </QueryClientProvider>
    </AuthProvider>
  )
}
