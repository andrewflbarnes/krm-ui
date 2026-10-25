import { fn } from 'storybook/test';
import { Meta, StoryObj } from 'storybook-solidjs-vite';
import RaceNewSelect from '@/components/RaceNewSelect';
import { ClubSeeding } from '@/kings';

const meta = {
  title: 'Kings/RaceNewSelect',
  render: props => {
    return <RaceNewSelect onErrorUpdate={props.onErrorUpdate} onUpdate={props.onUpdate} config={props.config || {}} />;
  },
  component: RaceNewSelect,
  args: {
    onUpdate: fn(),
    onErrorUpdate: fn(),
  },
} satisfies Meta<typeof RaceNewSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const initialConfig = (numTeams: number = 0): ClubSeeding => ['Bath', 'Bristol', 'Plymouth', 'Aberystwyth'].reduce((acc, club) => {
  acc[club] = {
    mixed: numTeams,
    ladies: numTeams,
    board: numTeams,
  }
  return acc
}, {} as ClubSeeding);

export const Default: Story = {
  args: {
    config: initialConfig(),
  },
};

const missingConfig = initialConfig(10);
export const MissingConfig: Story = {
  args: {
    config: missingConfig,
  }
};

const validConfig = initialConfig(1);
export const ValidConfig: Story = {
  args: {
    config: validConfig,
  }
};
