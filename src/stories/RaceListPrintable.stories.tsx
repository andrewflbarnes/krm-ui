import type { Meta, StoryObj } from 'storybook-solidjs';
import { knockouts, races } from './data';
import RaceListPrintable from '../components/RaceListPrintable';

const meta = {
  title: 'Kings/RaceListPrintable',
  render: props => <RaceListPrintable {...props} />,
  component: RaceListPrintable,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
  },
  args: {
  },
} satisfies Meta<typeof RaceListPrintable>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
  * Displays a printable race list
  */
export const Default: Story = {
  args: {
    races,
    subtitle: "western stage 2"
  },
};

/**
  * Displays a printable race list for knockouts
  */
export const Knockouts: Story = {
  args: {
    races: knockouts,
    subtitle: "western knockouts",
    knockouts: true,
  },
};
