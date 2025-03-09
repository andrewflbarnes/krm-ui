import type { Meta, StoryObj } from 'storybook-solidjs';
import RaceList from '../components/RaceList';
import { fn } from '@storybook/test';
import { knockouts, races } from './data';

const meta = {
  title: 'Kings/RaceList',
  component: RaceList,
} satisfies Meta<typeof RaceList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
  * Displays a list of races to run
  */
export const Default: Story = {
  args: {
    orderedRaces: races,
    onRaceUpdate: fn()
  },
};

/**
  * Displays a race list which can't be modified
  */
export const Readonly: Story = {
  args: {
    ...Default.args,
    readonly: true,
  },
};

/**
  * Displays a race list for knockouts with the positions (groups)
  */
export const Knockout: Story = {
  args: {
    orderedRaces: knockouts,
    onRaceUpdate: fn(),
    knockout: true,
  },
};
