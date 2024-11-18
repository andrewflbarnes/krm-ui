import tracker from "../api/tracker";
import {
  Box,
  Link,
  Typography,
} from "@suid/material";
import { For, Show } from "solid-js";
import LeagueResults from "../components/LeagueResults";
import { Suspense } from "solid-js";
import { createQuery } from "@tanstack/solid-query";
import { OpenInNew } from "@suid/icons-material";
import { orderResults } from "../kings/utils";
import { divisions, Result, useKings } from "../kings";

const immediateError = (message: string) => {
  const error = new Error(message);
  error.name = "ImmediateError";
  return error;
}

export default function ResultsView() {
  const [{ config, key: league }] = useKings()
  const getLeagueData = async () => {
    const url = config().tracker
    if (!url) {
      throw immediateError("No tracker URL found")
    }
    const leagueData = await tracker.getLeagueData(url)
    if (!leagueData) {
      throw immediateError("No data found")
    }
    // TODO move this to a memo or similar
    return divisions
      .map(division => {
        const divisionResult = []
        Object.values(leagueData).forEach(club => {
          Object.entries(club.teams[division] ?? {}).forEach(([name, { results }]) => {
            const tr: Result = {
              name,
              r1: results[0]?.[1],
              r2: results[1]?.[1],
              r3: results[2]?.[1],
              r4: results[3]?.[1],
            }
            tr.total = (tr.r1 >>> 0) + (tr.r2 >>> 0) + (tr.r3 >>> 0) + (tr.r4 >>> 0);
            divisionResult.push(tr)
          })
        })
        divisionResult.sort(orderResults)
        return {
          name: division,
          results: divisionResult,
        }
      })
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
        <Link sx={{ position: "absolute", right: 0 }} target="_blank" rel="noopener" href={`https://www.kingsski.club/${league().toLowerCase()}`}>
          <OpenInNew fontSize="small" />
        </Link>
        <Suspense fallback={<div>Loading...</div>}>
          <Show when={query.error}>
            <Typography variant="h3">
              {query.error.message}
            </Typography>
          </Show>
          <Show when={divisionResults()?.length > 0} fallback={<NoResults />}>
            <For each={divisionResults()}>{(division) => {
              return (
                <div>
                  <Typography mb="1rem" textAlign="center" variant="h4">
                    {division.name}
                  </Typography>
                  <LeagueResults results={division.results} />
                </div>
              )
            }}</For>
          </Show>
        </Suspense>
      </Box>
    </>
  )
}

function NoResults() {
  return (
    <Box sx={{
      display: "grid",
      placeItems: "center",
      height: "100%",
      width: "100%",
    }}>
      <Typography>
        No results found
      </Typography>
    </Box>
  )
}
