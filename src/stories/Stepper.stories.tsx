import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import Stepper from '../ui/Stepper';
import { fn } from 'storybook/test';

const meta = {
  title: 'ui/Stepper',
  component: Stepper,
  args: {
    steps: [
      { key: "step1", label: "Step 1", enabled: true },
      { key: "step2", label: "Step 2", enabled: true },
      { key: "step3", label: "Step 3", enabled: false },
    ],
    selected: "step2",
    current: "step2",
    onSelect: fn()
  },
  render: (args) => {
    return (
      <div style={{ width: "30em" }}>
        <Stepper {...args} />
      </div>
    )
  }
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CurrentSelected: Story = {
};

export const PriorSelected: Story = {
  args: {
    selected: "step1",
    current: "step2",
  }
};
