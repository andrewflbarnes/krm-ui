import { fn } from '@storybook/test';
import type { Meta, StoryObj } from 'storybook-solidjs';
import CustomRoundStage from '../components/CustomRoundStage';

const meta = {
  title: 'kings/CustomRoundStage',
  component: CustomRoundStage,
  args: {
    onConfigUpdated: fn()
  }
} satisfies Meta<typeof CustomRoundStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
}

export const WithPreviousSeeds: Story = {
  args: {
    previous: [
      { group: "A", teams: 4 },
      { group: "B", teams: 4 },
      { group: "C", teams: 4 },
      { group: "D", teams: 4 },
      { group: "E", teams: 4 },
      { group: "F", teams: 4 },
      { group: "G", teams: 4 },
      { group: "H", teams: 4 },
    ]
  }
}
