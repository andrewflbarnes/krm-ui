import { FormControlLabel, Switch, Typography } from "@suid/material";
import { createSignal, For, ParentProps } from "solid-js";
import MiniLeague from "./MiniLeague";
import { miniLeagueConfig } from "../kings";

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
    <For each={Object.entries(miniLeagueConfig)}>{([name, config]) => {
      const [collapsed, setCollapsed] = createSignal(false)
      const competingTeams = teams.slice(0, config.teams)
      return (
        <div style={{ "margin-top": "1em", "margin-bottom": "1em" }}>
          <FormControlLabel
            control={<Switch checked={collapsed()} onChange={() => setCollapsed(c => !c)} />}
            label="collapsed"
          />
          <MiniLeague name={name} races={config.races} teams={competingTeams} collapsed={collapsed()} />
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
