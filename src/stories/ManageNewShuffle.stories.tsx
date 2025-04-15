import { fn } from '@storybook/test';
import { createMemo, createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageNewShuffle from '../components/ManageNewShuffle';
import { raceConfig, Round, RoundSeeding } from '../kings';
import { createRound } from '../kings/round-utils';

const meta = {
  title: 'Kings/ManageNewShuffle',
  render: props => {
    const [seeds, setSeeds] = createSignal<RoundSeeding>()
    const round = createMemo<Round>(() => {
      return {
        ...props.round,
        teams: seeds() || props.round.teams,
      }
    })
    const handleShuffle = (seeds: RoundSeeding) => {
      props.onShuffle?.(seeds)
      setSeeds(seeds)
    }
    return <ManageNewShuffle inGroupSwaps={props.inGroupSwaps} seeding={props.seeding} originalConfig={props.originalConfig} round={round()} onShuffle={handleShuffle} />
  },
  component: ManageNewShuffle,
} satisfies Meta<typeof ManageNewShuffle>;

export default meta;
type Story = StoryObj<typeof meta>;

const seeding: RoundSeeding = {
  "mixed": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2", "Bath 3", "Aberystwyth 2"],
  "ladies": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2"],
  "board": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1"],
}

const round = createRound("id-of-round", "western", seeding, raceConfig)

export const Default: Story = {
  args: {
    round: round as Round,
    onShuffle: fn(),
    seeding: round.teams,
    originalConfig: round.config,
  },
};

/**
  * Allow swaps within groups
  */
export const InGroupSwaps: Story = {
  args: {
    round: round as Round,
    onShuffle: fn(),
    inGroupSwaps: true,
    seeding: round.teams,
    originalConfig: round.config,
  },
};
