import type { Meta, StoryObj } from 'storybook-solidjs';
import { createSignal, untrack } from "solid-js";
import { MiniLeagueTemplate, miniLeagueTemplates, Race } from "../kings";


import MiniLeague from './MiniLeague';

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

const MiniLeagueWithHandler = (props: {
  name: string;
  teams: string[];
  races: Race[];
  collapsed?: boolean;
  live?: boolean;
  readonly?: boolean;
}) => {
  const [races, setRaces] = createSignal<Race[]>(untrack(() => props.races))
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
  tags: ['autodocs'],
  argTypes: {
    live: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    readonly: { control: 'boolean' },
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
