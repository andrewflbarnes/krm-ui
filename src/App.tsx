import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { BreadcrumberProvider } from "./hooks/breadcrumb";
import { KingsProvider } from "./kings";
import { Route, Router } from "@solidjs/router";
import Home from "./pages/Home";
import RaceManager from "./pages/RaceManager";
import ConfigManager from "./pages/ConfigManager";
import Tracker from "./pages/Tracker";
import Portal from "./pages/Portal";
import Status404 from "./pages/Status404";
import AppLayout from "./AppLayout";
import { ParentProps } from "solid-js";
import { createTheme, ThemeProvider } from "@suid/material";
import RaceManagerConfigure from "./pages/RaceManagerConfigure";
import RaceManagerContinue from "./pages/RaceManagerContinue";
import RaceManagerStart from "./pages/RaceManagerStart";

const queryClient = new QueryClient()

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
    }}>
      <Router base="/krm-ui" root={HydratedAppLayout}>
        <Route path="/" component={Home} />
        <Route path="/race" component={RaceManager} info={{ breadcrumb: "Race" }}>
          <Route path="/"/>
          <Route path="/configure" component={RaceManagerConfigure} info={{ breadcrumb: "Config" }} />
          <Route path="/continue" component={RaceManagerContinue} info={{ breadcrumb: "Continue" }} />
          <Route path="/start" component={RaceManagerStart} info={{ breadcrumb: "Start" }} />
        </Route>
        <Route path="/config" component={ConfigManager} info={{ breadcrumb: "Config" }} />
        <Route path="/tracker" component={Tracker} info={{ breadcrumb: "Tracker" }} />
        <Route path="/portal" component={Portal} info={{ breadcrumb: "Portal" }} />
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
