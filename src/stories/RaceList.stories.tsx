import type { Meta, StoryObj } from 'storybook-solidjs';
import RaceList from '../components/RaceList';
import { fn } from '@storybook/test';
import { knockouts, races } from './data';
import { ComponentProps, createEffect, createSignal, untrack } from 'solid-js';
import { Race } from '../kings';

const RaceListWithHandler = (props: ComponentProps<typeof RaceList>) => {
  const [races, setRaces] = createSignal<Race[]>(untrack(() => props.orderedRaces))
  createEffect(() => {
    setRaces(props.orderedRaces)
  })
  const handleResultChange = (result: Race) => {
    const newRaces = [...races()]
    newRaces[result.groupRace] = result
    console.log("Received result change event: " + JSON.stringify(result))
    setRaces(newRaces)
    props.onRaceUpdate(result)
  }
  return <RaceList {...props} onRaceUpdate={handleResultChange} orderedRaces={races()} />
}

const meta = {
  title: 'Kings/RaceList',
  component: RaceList,
  render: (props) => <RaceListWithHandler {...props} />,
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
  play: undefined,
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
