import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageConfigRound from '../components/ManageConfigRound';
import { raceConfig } from '../kings';

const meta = {
  title: 'kings/ManageConfigRound',
  component: ManageConfigRound,
} satisfies Meta<typeof ManageConfigRound>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "9 teams",
    config: raceConfig["9"]
  }
}

