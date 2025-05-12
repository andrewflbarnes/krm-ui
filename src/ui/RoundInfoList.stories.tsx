import type { Meta, StoryObj } from 'storybook-solidjs';
import { fn } from '@storybook/test';
import RoundInfoList from './RoundInfoList';
import { miniLeagueTemplates } from '../kings';
import { RoundInfo } from '../api/krm';
import { Route, Router } from '@solidjs/router';

const meta = {
  title: 'Kings/RoundInfoList',
  render: props => (
    <Router>
      <Route path="/*" component={() => <RoundInfoList {...props} />} />
    </Router>
  ),
  component: RoundInfoList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
    handleInfo: fn(),
    handleConfirmDelete: fn(),
    handleConfirmExport: fn(),
    handleUploadRound: fn(),
    canUpload: true,
    userId: "owner-id",
  },
} satisfies Meta<typeof RoundInfoList>;

export default meta;
type Story = StoryObj<typeof meta>;

const examplepTeams = {
  mixed: ["Bath 1", "Bristol 1", "Cardiff 1", "Exeter 1", "Plymouth 1", "Swansea 1"],
  ladies: ["Plymouth 1", "Swansea 1"],
  board: ["Aberystwyth 1", "Bath 1", "Bristol 1", "Cardiff 1", "Exeter 1", "Plymouth 1", "Swansea 1"],
}
const exampleRound: RoundInfo = {
  id: "round-id-12345",
  status: "complete",
  details: {
    venue: "Gloucester",
    description: "This is a local round with a lengthy description for the round",
    date: new Date(),
    round: "1"
  },
  teams: examplepTeams,
  distributionOrder: examplepTeams,
  owner: "local",
  league: "western",
  config: {
    mixed: {
      stage1: [{ name: "A", seeds: [{ group: "Seeds", position: 1 }], template: miniLeagueTemplates.mini4 }],
      results: [{ stage: "stage1", group: "A", position: 1, rank: 1 }],
    },
    ladies: {
      stage1: [{ name: "A", seeds: [{ group: "Seeds", position: 1 }], template: miniLeagueTemplates.mini4 }],
      results: [{ stage: "stage1", group: "A", position: 1, rank: 1 }],
    },
    board: {
      stage1: [{ name: "A", seeds: [{ group: "Seeds", position: 1 }], template: miniLeagueTemplates.mini4 }],
      results: [{ stage: "stage1", group: "A", position: 1, rank: 1 }],
    },
  }
}

const trackedRound: RoundInfo = {
  ...exampleRound,
  owner: "owner-id",
  details: {
    ...exampleRound.details,
    round: "3",
    description: "This round is tracked",
  },
  status: "stage1",
}

const otherRound: RoundInfo = {
  ...exampleRound,
  owner: "other-owner-id",
  details: {
    ...exampleRound.details,
    round: "2",
    description: "This round is untracked",
  },
  status: "knockout",
}

/**
  * Displays a list of rounds
  */
export const Default: Story = {
  args: {
    rounds: [exampleRound, trackedRound, otherRound],
  },
};

/**
  * Displays a list of rounds
  */
export const Multiple: Story = {
  args: {
    rounds: [exampleRound, trackedRound, otherRound, exampleRound, trackedRound, otherRound],
  },
};

/**
  * Displays a list of rounds without any tracked
  */
export const NoTracked: Story = {
  args: {
    rounds: [exampleRound, otherRound],
  },
};

/**
  * Displays a list of rounds without any untracked
  */
export const NoUntracked: Story = {
  args: {
    rounds: [trackedRound, otherRound],
  },
};

/**
  * Displays a list of rounds without any owned
  */
export const NoOwned: Story = {
  args: {
    rounds: [otherRound],
  },
};
