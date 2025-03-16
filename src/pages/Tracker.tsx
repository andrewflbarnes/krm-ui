import tracker from "../api/tracker";
import {
  Box,
  LinearProgress,
  Link,
  Typography,
} from "@suid/material";
import { Match, ParentProps, Switch } from "solid-js";
import { Suspense } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { OpenInNew } from "@suid/icons-material";
import { parseResults } from "../kings/utils";
import { LeagueData, useKings } from "../kings";
import DivisionResultsAll from "../components/DivisionResultsAll";

const immediateError = (message: string) => {
  const error = new Error(message);
  error.name = "ImmediateError";
  return error;
}

export default function Tracker() {
  const [{ league }] = useKings()
  const getLeagueData = async () => {
    const leagueData: LeagueData = await tracker.getLeagueData(league())
    if (!leagueData) {
      throw immediateError("No data found")
    }
    return parseResults(leagueData)
  }

  const query = createQuery(() => ({
    queryKey: [league()],
    queryFn: getLeagueData,
    staleTime: 1000 * 60 * 5,
    retry: (_, e) => e.name === "ImmediateError" ? false : 3,
  }))

  const divisionResults = () => query.data

  return (
    <>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "3rem",
        position: "relative",
        height: "100%",
        width: "100%",
      }}>
        <Suspense fallback={<Loading />}>
          <Link sx={{ position: "absolute", right: 0 }} target="_blank" rel="noopener" href={`https://www.kingsski.club/${league().toLowerCase()}`}>
            <OpenInNew fontSize="small" />
          </Link>
          <Switch fallback={<NoResults />}>
            <Match when={query.error}>
              <NoResults>{query.error.message}</NoResults>
            </Match>
            <Match when={Object.keys(divisionResults() ?? {}).length > 0}>
              <DivisionResultsAll results={divisionResults()} />
            </Match>
          </Switch>
        </Suspense>
      </Box>
    </>
  )
}

function Loading() {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress />
    </Box>
  )
}

function NoResults(props: ParentProps) {
  return (
    <Box sx={{
      display: "grid",
      placeItems: "center",
      height: "100%",
      width: "100%",
    }}>
      <Typography variant="h3">
        {props.children ?? "No results found"}
      </Typography>
    </Box>
  )
}
