import { waitFor } from '@solidjs/testing-library';
import { expect, fn, userEvent } from '@storybook/test';
import type { Meta, StoryObj } from 'storybook-solidjs';
import CustomRoundStage from '../components/CustomRoundStage';

const meta = {
  title: 'kings/CustomRoundStage',
  component: CustomRoundStage,
  args: {
    onConfigUpdated: fn()
  },
  play: async ({ canvas, step }) => {
    await step('Add minileague 1', async () => {
      await userEvent.click(canvas.getByText("Add minileague"))
      await waitFor(() => expect(canvas.getByText("mini4")).toBeInTheDocument())
      await userEvent.click(canvas.getByText("mini4"))
    })
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
