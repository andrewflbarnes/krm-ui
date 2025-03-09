import type { Meta, StoryObj } from 'storybook-solidjs';
import { ComponentProps, createEffect, createSignal, untrack } from "solid-js";
import { MiniLeagueTemplate, miniLeagueTemplates, Race } from "../kings";
import MiniLeague from '../components/MiniLeague';
import { fn } from '@storybook/test';

const teams = [
  "Bath 1",
  "Bristol 2",
  "Plymouth 1",
  "Exeter 3",
  "Aber 1",
  "Cardiff 2"
]
const initTeams = (mlt: MiniLeagueTemplate) => teams.slice(0, mlt.teams)

const initRaces = (mlt: MiniLeagueTemplate) => mlt.races.map((r, ri) => ({
  team1: teams[r[0] - 1],
  team2: teams[r[1] - 1],
  division: "mixed" as const,
  stage: "stage1" as const,
  group: "Z",
  groupRace: ri,
  teamMlIndices: r,
}))

// Identical to above but reverse the teams to ensure rendering isn't affected
function initRacesInverse(mlt: MiniLeagueTemplate): Race[] {
  return initRaces(mlt).map(r => ({
    ...r,
    teamMlIndices: [r.teamMlIndices[1], r.teamMlIndices[0]],
  }))
}

const MiniLeagueWithHandler = (props: ComponentProps<typeof MiniLeague>) => {
  const [races, setRaces] = createSignal<Race[]>(untrack(() => props.races))
  createEffect(() => {
    setRaces(props.races)
  })
  const handleResultChange = (result: Race) => {
    const newRaces = [...races()]
    newRaces[result.groupRace] = result
    console.log("Received result change event: " + JSON.stringify(result))
    setRaces(newRaces)
    //notification.info("Received result change event: " + JSON.stringify(result))
  }
  return <MiniLeague {...props} onResultChange={handleResultChange} races={races()} />
}

const meta = {
  title: 'Kings/MiniLeague',
  render: props => <MiniLeagueWithHandler {...props} />,
  component: MiniLeague,
  argTypes: {
    live: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: {
    onResultChange: fn(),
  },
} satisfies Meta<typeof MiniLeague>;

export default meta;

type Story = StoryObj<typeof meta>;

const m3 = miniLeagueTemplates.mini3
export const Teams3: Story = {
  args: {
    name: "Mini 3",
    teams: initTeams(m3),
    races: initRaces(m3),
  },
}

const m4 = miniLeagueTemplates.mini4
export const Teams4: Story = {
  args: {
    name: "Mini 4",
    teams: initTeams(m4),
    races: initRaces(m4),
  },
}

/**
  * Ensure that when teams are on other sides of the course, the rendering is correct
  */
export const TeamsInverse4: Story = {
  args: {
    name: "Mini 4 Inverse",
    teams: initTeams(m4),
    races: initRacesInverse(m4),
  },
}

/**
  * Make races share columns where possible
  */
export const TeamsCollapse4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Collapsed",
    collapsed: true,
  },
}

/**
  * Readonly mini leagues can't be updated
  */
export const TeamsReadonly4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Readonly",
    collapsed: true,
  },
}

/**
  * Live mini leagues will show positions as soon as once race has occurred
  */
export const TeamsLive4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Live",
    live: true,
  },
}


const m5 = miniLeagueTemplates.mini5
export const Teams5: Story = {
  args: {
    name: "Mini 5",
    teams: initTeams(m5),
    races: initRaces(m5),
  },
}

const m6 = miniLeagueTemplates.mini6
export const Teams6: Story = {
  args: {
    name: "Mini 6",
    teams: initTeams(m6),
    races: initRaces(m6),
  },
}

const f3 = miniLeagueTemplates.full3
export const Full3: Story = {
  args: {
    name: "Full 3",
    teams: initTeams(f3),
    races: initRaces(f3),
  },
}

const ko = miniLeagueTemplates.knockout
export const Knockout: Story = {
  args: {
    name: "Knockout",
    teams: initTeams(ko),
    races: initRaces(ko),
  },
}
