import { fn } from '@storybook/test';
import { createMemo, createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageNewShuffle from '../components/ManageNewShuffle';
import { Round, RoundSeeding } from '../kings';
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
    return <ManageNewShuffle round={round()} onShuffle={handleShuffle} />
  },
  component: ManageNewShuffle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
  },
} satisfies Meta<typeof ManageNewShuffle>;

export default meta;
type Story = StoryObj<typeof meta>;

const seeding: RoundSeeding = {
  "mixed": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2", "Bath 3", "Aberystwyth 2"],
  "ladies": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2"],
  "board": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1"],
}

const round = createRound("id-of-round", "western", seeding)

export const Default: Story = {
  args: {
    round: round as Round,
    onShuffle: fn(),
  },
};
