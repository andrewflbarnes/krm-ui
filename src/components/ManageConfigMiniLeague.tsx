import { DownhillSkiing, Groups } from "@suid/icons-material";
import { Chip, Typography } from "@suid/material";
import { createMemo } from "solid-js";
import { MiniLeagueTemplate, Race } from "../kings";
import ValidIcon from "../ui/ValidIcon";
import styles from "./ManageConfigMiniLeague.module.css";
import MiniLeague from "./MiniLeague";

type Props = {
  name: string;
  template: MiniLeagueTemplate;
}

export default function ManageConfigMiniLeague(props: Props) {
  const validRaceCount = () => {
    const expected = props.template.teams * (props.template.teams - 1) / 2
    return props.template.races.length % expected == 0
  }
  const allRaceAll = () => {
    for (let i = 0; i < props.template.teams; i++) {
      for (let j = i + 1; j < props.template.teams; j++) {
        if (!props.template.races.find(r => r[0] == i && r[1] == j || r[0] == j && r[1] == i)) {
          return false
        }
      }
    }
    return true
  }
  const evenSides = () => {
    const sideCounts = Array.from({ length: props.template.teams }, () => 0)
    props.template.races.forEach(r => {
      ++sideCounts[r[0]]
      --sideCounts[r[1]]
    })
    return sideCounts.every(c => c < 2 && c > -2)
  }
  const validTeams = () => props.template.races.every(r => r[0] < props.template.teams && r[1] < props.template.teams)
  const noSelfRaces = () => props.template.races.every(r => r[0] != r[1])
  const teams = createMemo(() => Array.from({ length: props.template.teams }, (_, i) => `Team ${i + 1}`))
  const races = (): Race[] => props.template.races.map((r, i) => ({
    team1: teams()[r[0]],
    team2: teams()[r[1]],
    group: "A",
    stage: "stage1",
    division: "mixed",
    groupRace: i,
    teamMlIndices: r,
  }))
  return (
    <div style={{ display: "flex", "flex-direction": "column", "justify-content": "center", "align-items": "center", gap: "1rem" }}>
      <div style={{ display: "flex", "align-items": "center", gap: "2em", width: "100%", "justify-content": "center" }}>
        <div style={{ display: "flex", "flex-direction": "column", "align-items": "flex-end", width: "50%" }}>
          <Typography variant="h2">
            {props.name}
          </Typography>
          <div style={{ display: "flex", gap: "1em" }}>
            <Chip label={`${props.template.teams} teams`} size="small" icon={<Groups />} color="primary" variant="outlined" />
            <Chip label={`${props.template.races.length} races`} size="small" icon={<DownhillSkiing />} color="primary" variant="outlined" />
          </div>
        </div>
        <div style={{ width: "50%" }}>
          <Typography>
            <div style={{
              display: "flex",
              "flex-direction": "column",
              "align-items": "flex-start",
            }}>
              <div class={styles.info}>
                <ValidIcon valid={validRaceCount()} />
                &nbsp;Correct number of races
              </div>
              <div class={styles.info}>
                <ValidIcon valid={allRaceAll()} />
                &nbsp;All teams race each other
              </div>
              <div class={styles.info}>
                <ValidIcon valid={evenSides()} />
                &nbsp;Teams alternate sides
              </div>
              <div class={styles.info}>
                <ValidIcon valid={validTeams()} />
                &nbsp;Racing teams are valid (1 - {props.template.teams})
              </div>
              <div class={styles.info}>
                <ValidIcon valid={noSelfRaces()} />
                &nbsp;Teams don't race themselves
              </div>
            </div>
          </Typography>
        </div>
      </div>
      <MiniLeague
        races={races()}
        teams={teams()}
        name={props.name}
        readonly
        onResultChange={() => { }}
      />
    </div>
  )
}
