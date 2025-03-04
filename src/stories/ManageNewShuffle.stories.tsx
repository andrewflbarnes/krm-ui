import { fn } from '@storybook/test';
import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageNewShuffle from '../components/ManageNewShuffle';
import { Round, RoundSeeding } from '../kings';
import { createRound } from '../kings/round-utils';

const meta = {
  title: 'Kings/ManageNewShuffle',
  render: props => <ManageNewShuffle {...props} />,
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
