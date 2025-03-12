import type { Meta, StoryObj } from 'storybook-solidjs';
import RaceResultIcon from '../ui/RaceResultIcon';

const meta = {
  title: 'Kings/ui/RaceResultIcon',
  component: RaceResultIcon,
  args: {
    won: false,
    conceded: false,
    dsq: false,
  }
} satisfies Meta<typeof RaceResultIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    won: false,
  },
};

export const Win: Story = {
  args: {
    won: true,
  },
}

export const Conceded: Story = {
  args: {
    won: false,
    conceded: true,
  },
}

export const Dsq: Story = {
  args: {
    won: false,
    dsq: true,
  },
}

export const DsqWin: Story = {
  args: {
    won: true,
    dsq: true,
  },
}
