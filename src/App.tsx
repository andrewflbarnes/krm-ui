import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./kings";
import { Route, Router } from "@solidjs/router";
import { createMemo, createSignal, lazy, ParentProps } from "solid-js";
import { createPalette, createTheme, ThemeProvider } from "@suid/material";
import AppLayout from "./AppLayout";
const Home = lazy(() => import("./pages/Home"));
const Developer = lazy(() => import("./pages/Developer"));
const RaceManager = lazy(() => import("./pages/Manage"));
const ConfigManager = lazy(() => import("./pages/ConfigManager"));
const Tracker = lazy(() => import("./pages/Tracker"));
const Portal = lazy(() => import("./pages/Portal"));
const Status404 = lazy(() => import("./pages/Status404"));
const RaceManagerConfigure = lazy(() => import("./pages/ManageConfigure"));
const RaceManagerContinue = lazy(() => import("./pages/ManageContinue"));
const RaceManagerNew = lazy(() => import("./pages/ManageNew"));
const RunRace = lazy(() => import("./pages/RunRace"));
import { Toaster } from "solid-toast";
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
        <Route path="/" component={Home} />
        <Route path="/manage" component={RaceManager} info={{ breadcrumb: "Manage" }}>
          <Route path="/" />
          <Route path="/new" component={RaceManagerNew} info={{ breadcrumb: "New" }} />
          <Route path="/continue" component={RaceManagerContinue} info={{ breadcrumb: "Continue" }} />
          <Route path="/configure" component={RaceManagerConfigure} info={{ breadcrumb: "Config" }} />
        </Route>
        <Route path="/config" component={ConfigManager} info={{ breadcrumb: "Config" }} />
        <Route path="/tracker" component={Tracker} info={{ breadcrumb: "Tracker" }} />
        <Route path="/portal" component={Portal} info={{ breadcrumb: "Portal" }} />
        <Route path="/dev" component={Developer} info={{ breadcrumb: "Developer" }}>
          <Route path="/:devview?" />
        </Route>
        <Route path="/:raceid" component={RunRace} info={{ breadcrumb: "Race" }} />
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
