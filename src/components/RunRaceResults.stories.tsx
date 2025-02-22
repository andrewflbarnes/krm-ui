import type { Meta, StoryObj } from 'storybook-solidjs';

import { fn } from '@storybook/test';

import RunRaceResults from './RunRaceResults';
import { Round } from '../kings';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/solid/writing-stories/introduction
const meta = {
  title: 'Kings/RunRaceResults',
  render: props => <RunRaceResults {...props} />,
  component: RunRaceResults,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
  },
} satisfies Meta<typeof RunRaceResults>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/solid/writing-stories/args

const results: Round["results"] = {
  "mixed": [
    { rank: 1, rankStr: "1st", teams: ["Bath 1"] },
    { rank: 2, rankStr: "2nd", teams: ["Bristol 1"] },
    { rank: 3, rankStr: "3rd", teams: ["Plymouth 1"] },
    { rank: 4, rankStr: "4th", teams: ["Aberystwyth 1"] },
    { rank: 5, rankStr: "5th", teams: ["Bath 2"] },
    { rank: 6, rankStr: "Joint 6th", teams: ["Plymouth 2", "Bath 3"] },
    { rank: 8, rankStr: "8th", teams: ["Aberystwyth 2"] },
  ],
  "ladies": [
    { rank: 1, rankStr: "1st", teams: ["Bath 1"] },
    { rank: 2, rankStr: "2nd", teams: ["Bristol 1"] },
    { rank: 3, rankStr: "3rd", teams: ["Plymouth 1"] },
    { rank: 4, rankStr: "4th", teams: ["Aberystwyth 1"] },
    { rank: 5, rankStr: "5th", teams: ["Bath 2"] },
    { rank: 6, rankStr: "Joint 6th", teams: ["Plymouth 2", "Bath 3"] },
    { rank: 8, rankStr: "8th", teams: ["Aberystwyth 2"] },
    { rank: 9, rankStr: "9th", teams: ["Aberystwyth 3"] },
  ],
  "board": [
    { rank: 1, rankStr: "1st", teams: ["Bath 1"] },
    { rank: 2, rankStr: "2nd", teams: ["Bristol 1"] },
    { rank: 3, rankStr: "3rd", teams: ["Plymouth 1"] },
    { rank: 4, rankStr: "4th", teams: ["Aberystwyth 1"] },
  ],
}

/**
  * Displays the results for each division in a round with default points algo.
  */
export const Default: Story = {
  args: {
    round: {
      results,
    } as Round
  },
};

/**
  * Displays results with a custom points algo
  */
export const CustomPointsAlgo: Story = {
  args: {
    round: {
      results,
    } as Round,
    points: (_: string, rank: number) => {
      return (50 - rank) * 2
    }
  },
};
