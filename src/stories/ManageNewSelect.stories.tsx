import { fn } from 'storybook/test';
import { Meta, StoryObj } from 'storybook-solidjs-vite';
import ManageNewSelect from '../components/ManageNewSelect';
import { ClubSeeding } from '../kings';

const meta = {
  title: 'Kings/ManageNewSelect',
  render: props => {
    return <ManageNewSelect onErrorUpdate={props.onErrorUpdate} onUpdate={props.onUpdate} config={props.config || {}} />;
  },
  component: ManageNewSelect,
  args: {
    onUpdate: fn(),
    onErrorUpdate: fn(),
  },
} satisfies Meta<typeof ManageNewSelect>;

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
