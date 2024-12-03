import { FormControlLabel, Switch, Typography } from "@suid/material";
import { createSignal, For, ParentProps } from "solid-js";
import MiniLeague from "./MiniLeague";
import { miniLeagueTemplates } from "../kings";
import notification from "../hooks/notification";

export default function DeveloperUIComponents() {
  return (
    <>
      <Typography>
        Developer UI Components
      </Typography>
      <Demo title="Minileague">
        <MiniLeagueDemo />
      </Demo>
    </>
  )
}

const teams = ["Bath 1", "Bristol 2", "Plymouth 1", "Exeter 3", "Aber 1", "Cardiff 2"]
function MiniLeagueDemo() {
  return (
    <For each={Object.entries(miniLeagueTemplates)}>{([name, config]) => {
      const [collapsed, setCollapsed] = createSignal(false)
      const competingTeams = teams.slice(0, config.teams)
      const [results, setResults] = createSignal(Array.from(Array(config.races.length)).map(() => ({
        winner: undefined,
      })))
      const handleResultChange = (result) => {
        const newResults = [ ...results()]
        newResults[result.raceIndex] = {
          winner: result.winnerOrd,
        }
        setResults(newResults)
        notification.info("Received result change event: " + JSON.stringify(result))
      }
      return (
        <div style={{ "margin-top": "1em", "margin-bottom": "1em" }}>
          <FormControlLabel
            control={<Switch checked={collapsed()} onChange={() => setCollapsed(c => !c)} />}
            label="collapsed"
          />
          <MiniLeague
            name={name}
            races={config.races}
            teams={competingTeams} collapsed={collapsed()}
            results={results()}
            onResultChange={handleResultChange}
          />
        </div>
      )
    }}</For>
  )
}

function Demo(props: ParentProps<{ title: string }>) {
  return (
    <div style={{ display: "flex", "flex-direction": "column", "align-items": "start" }}>
      <Typography variant="h6">
        {props.title}
      </Typography>

      {props.children}
    </div>
  )
}
