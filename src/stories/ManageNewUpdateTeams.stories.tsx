import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ManageNewUpdateTeams from '../components/ManageNewUpdateTeams';

const meta = {
  title: 'Kings/ManageNewUpdateTeams',
  component: ManageNewUpdateTeams,
} satisfies Meta<typeof ManageNewUpdateTeams>;

export default meta;
type Story = StoryObj<typeof meta>;

const missingTeams = [
  { club: "Bath", team: "Bath 4", division: "mixed" },
  { club: "Bath", team: "Bath 5", division: "mixed" },
  { club: "Bath", team: "Bath 6", division: "mixed" },
  { club: "Bristol", team: "Bristol 4", division: "ladies" },
  { club: "Bristol", team: "Bristol 6", division: "ladies" },
  { club: "Bristol", team: "Bristol 6", division: "ladies" },
  { club: "Cardiff", team: "Cardiff 4", division: "board" },
  { club: "Aberystwyth", team: "Aberystwyth 4", division: "board" },
  { club: "Aberystwyth", team: "Aberystwyth 5", division: "board" },
  { club: "Aberystwyth", team: "Aberystwyth 6", division: "board" },
]

export const Default: Story = {
  args: {
    missingTeams,
  },
};
