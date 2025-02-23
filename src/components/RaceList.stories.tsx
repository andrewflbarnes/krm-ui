import type { Meta, StoryObj } from 'storybook-solidjs';

import RaceList from './RaceList';
import { fn } from '@storybook/test';
import { Race } from '../kings';

const meta = {
  title: 'Kings/RaceList',
  render: props => <RaceList {...props} />,
  component: RaceList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
  },
} satisfies Meta<typeof RaceList>;

export default meta;
type Story = StoryObj<typeof meta>;

const orderedRaces: Race[] = [
  { group: "1st/2nd", team1: "Bath 1", team2: "Bristol 1", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1, winner: 1 },
  { group: "3rd/4th", team1: "Bath 2", team2: "Bristol 2", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1, winner: 2 },
  { group: "5th/6th", team1: "Bath 3", team2: "Bristol 3", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1, winner: 1, team2Dsq: true },
  { group: "7th/8th", team1: "Bath 4", team2: "Bristol 4", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1, winner: 1, team1Dsq: true, team2Dsq: true },
  { group: "9th/10th", team1: "Aberystwyth 1", team2: "Plymouth 1", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1 },
  { group: "11th/12th", team1: "Aberystwyth 2", team2: "Plymouth 2", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1 },
  { group: "13th/14th", team1: "Aberystwyth 3", team2: "Plymouth 3", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1 },
  { group: "15th/16th", team1: "Aberystwyth 4", team2: "Plymouth 4", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1 },
]
const knockouts = [ ...orderedRaces ].reverse()

/**
  * Displays a list of races to run
  */
export const Default: Story = {
  args: {
    orderedRaces,
    onRaceUpdate: fn()
  },
};

/**
  * Displays a race list which can't be modified
  */
export const Readonly: Story = {
  args: {
    orderedRaces,
    onRaceUpdate: fn(),
    readonly: true,
  },
};

/**
  * Displays a race list for knockouts with the positions (groups)
  */
export const Knockout: Story = {
  args: {
    orderedRaces: knockouts,
    onRaceUpdate: fn(),
    knockout: true,
  },
};
