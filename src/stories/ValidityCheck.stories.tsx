import type { Meta, StoryObj } from 'storybook-solidjs';
import ValidityCheck from '../ui/ValidityCheck';

const meta = {
  title: 'ui/ValidityCheck',
  component: ValidityCheck,
} satisfies Meta<typeof ValidityCheck>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Valid: Story = {
  args: {
    valid: true,
    children: "This check passed",
  },
};

export const Invalid: Story = {
  args: {
    valid: false,
    children: "This check failed",
  },
};
