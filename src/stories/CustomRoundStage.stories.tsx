import type { Meta, StoryObj } from 'storybook-solidjs';
import CustomRoundStage from '../components/CustomRoundStage';

const meta = {
  title: 'kings/CustomRoundStage',
  component: CustomRoundStage,
} satisfies Meta<typeof CustomRoundStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
}
