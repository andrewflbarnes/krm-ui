import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ManageNewSeeding from '../components/ManageNewSeeding';
import { RoundSeeding } from '../kings';
import { fn } from 'storybook/test';
import { createComputed, createSignal } from 'solid-js';

const seeds: RoundSeeding = {
  "mixed": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2", "Bath 3", "Aberystwyth 2"],
  "ladies": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2"],
  "board": ["Bath 1", "Bristol 1", "Plymouth 1", "Aberystwyth 1"],
}

const meta = {
  title: 'Kings/ManageNewSeeding',
  component: ManageNewSeeding,
  args: {
    seeds,
  }
} satisfies Meta<typeof ManageNewSeeding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    seeds
  },
};

export const Editable: Story = {
  args: {
    seeds,
    editable: true,
  },
};

export const EditableReactive: Story = {
  args: {
    seeds
  },
  render: (props: { seeds: RoundSeeding }) => {
    const [seeds, setSeeds] = createSignal<RoundSeeding>()
    createComputed(() => {
      setSeeds(props.seeds)
    })

    const handleEdit = (next: RoundSeeding) => {
      setSeeds(next)
    }

    return <ManageNewSeeding seeds={seeds()} editable onEdit={handleEdit} />
  }
};

export const WithOriginalSeeds: Story = {
  args: {
    seeds,
    originalSeeds: {
      ...seeds,
      mixed: seeds.mixed.toSpliced(0, 2, seeds.mixed[1], seeds.mixed[0]),
    },
    onEdit: fn(),
  },
};

export const EditableWithOriginalSeeds: Story = {
  args: {
    ...WithOriginalSeeds.args,
    editable: true,
  }
};
