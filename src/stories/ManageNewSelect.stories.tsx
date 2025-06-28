import { expect, fn, userEvent, waitFor, within } from '@storybook/test';
import { ComponentProps, createSignal } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageNewSelect from '../components/ManageNewSelect';
import { ClubSeeding } from '../kings';

type OnUpdate = ComponentProps<typeof ManageNewSelect>["onUpdate"]

const meta = {
  title: 'Kings/ManageNewSelect',
  render: props => {
    const onUpdate: OnUpdate = (club, division, count) => {
      props.onUpdate(club, division, count);
      setConfig(prev => ({
        ...prev,
        [club]: {
          ...prev[club],
          [division]: count,
        }
      }));
    }
    const [storyConfig, setConfig] = createSignal<ClubSeeding>({});
    const config = () => {
      console.log(JSON.parse(JSON.stringify(props.config)), storyConfig());
      const newConfig = { ...(props.config ?? {}) };
      const sconf = storyConfig();
      Object.keys(sconf).forEach(club => {
        newConfig[club] = {
          ...newConfig[club],
          ...sconf[club],
        }
      });
      return newConfig
    }

    return <ManageNewSelect onUpdate={onUpdate} config={config()} />;
  },
  component: ManageNewSelect,
  args: {
    onUpdate: fn(),
  }
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
  }
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

export const AddedClub: Story = {
  args: {
    ...Default.args,
  },
  play: async ({ canvas, step }) => {
    const addClub = canvas.getByTestId('add-team')
    const addClubText = within(addClub).getByRole('textbox');
    const addClubButton = within(addClub).getByRole('button');

    await step('Check club can be added', async () => {
      await expect(addClubText).toBeVisible();
      await expect(addClubButton).toBeVisible();
    })

    await step('Select club entry input', async () => {
      await userEvent.click(addClubText);
    })
    await step('Type Test as new club in input', async () => {
      await userEvent.type(addClubText, 'Test');
    })
    await step('Click to add club', async () => {
      await userEvent.click(addClubButton);
    })

    await step('New club successfully added', async () => {
      await waitFor(() => {
        expect(within(addClub).queryByText('Test')).not.toBeInTheDocument();
        expect(canvas.getByRole('cell', { name: 'Test' })).toBeInTheDocument();
      })
    })
  }
}
