import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./kings";
import { Route, Router } from "@solidjs/router";
import { lazy, ParentProps } from "solid-js";
import { createTheme, ThemeProvider } from "@suid/material";
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

const queryClient = new QueryClient()

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
    }}>
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
  const theme = createCustomTheme()
  return (
    <QueryClientProvider client={queryClient}>
      <BreadcrumberProvider>
        <KingsProvider>
          <ThemeProvider theme={theme}>
            <AppLayout>
              {props.children}
            </AppLayout>
          </ThemeProvider>
        </KingsProvider>
      </BreadcrumberProvider>
    </QueryClientProvider>
  )
}

function createCustomTheme() {
  return createTheme({
    palette: {
      mode: "dark"
    }
  })
}
