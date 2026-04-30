import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ManageNewSeeding from '../components/ManageNewSeeding';
import { RoundSeeding } from '../kings';

const seeds: RoundSeeding = {
  "mixed": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2", "Bath 3", "Aberystwyth 2"],
  "ladies": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2"],
  "board": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1"],
}

const meta = {
  title: 'Kings/ManageNewSeeding',
  component: ManageNewSeeding,
  args: {
    seeds,
  }
} satisfies Meta<typeof ManageNewSeeding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seeds
  },
};
