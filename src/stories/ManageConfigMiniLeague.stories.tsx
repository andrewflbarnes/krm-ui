import type { Meta, StoryObj } from 'storybook-solidjs';
import ManageConfigMiniLeague from '../components/ManageConfigMiniLeague';
import { MiniLeagueTemplate } from '../kings';

const meta = {
  title: 'Kings/ManageConfigMiniLeague',
  component: ManageConfigMiniLeague,
} satisfies Meta<typeof ManageConfigMiniLeague>;
export default meta;

type Story = StoryObj<typeof meta>;

const goodTemplate: MiniLeagueTemplate = {
  teams: 4,
  races: [
    [0, 1], [2, 3],
    [1, 2], [3, 0],
    [0, 2], [3, 1],
  ]
}

export const Default: Story = {
  args: {
    name: "Mini 4",
    template: goodTemplate,
  },
}

export const MissingRace: Story = {
  args: {
    ...Default.args,
    template: {
      ...goodTemplate,
      races: goodTemplate.races.slice(0, -1),
    }
  }
}

export const AdditionalRace: Story = {
  args: {
    ...Default.args,
    template: {
      ...goodTemplate,
      races: [...goodTemplate.races, [0, 1]],
    }
  }
}

export const InvalidTeams: Story = {
  args: {
    ...Default.args,
    template: {
      ...goodTemplate,
      races: goodTemplate.races.map(r => [r[0] + 1, r[1] + 1]),
    }
  }
}

export const SelfRace: Story = {
  args: {
    ...Default.args,
    template: {
      ...goodTemplate,
      races: [...goodTemplate.races, [1, 1]],
    }
  }
}
