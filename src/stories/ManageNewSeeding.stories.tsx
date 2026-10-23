import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import ManageNewSeeding from '../components/ManageNewSeeding';
import { RoundSeeding } from '../kings';
import { expect, fn, userEvent } from 'storybook/test';
import { createComputed, createSignal } from 'solid-js';

const seeds: RoundSeeding = {
  "mixed": ["Cardiff 1", "Swansea 1", "Plymouth 1", "Aberystwyth 1", "Bath 2", "Plymouth 2", "Bath 3", "Aberystwyth 2"],
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
  },
  play: async ({ canvas, step }) => {
    await step('Check Cardiff 1 and Swansea 1 are first/second respectively', async () => {
      expect(canvas.getByText("Cardiff 1").parentElement).toHaveTextContent("1Cardiff 1")
      expect(canvas.getByText("Swansea 1").parentElement).toHaveTextContent("2Swansea 1")
    })

    const cardiffDrag = canvas.getByTestId("mixed-Cardiff 1-drag-anchor")
    const swanseaDrag = canvas.getByTestId("mixed-Swansea 1-drag-anchor")

    await step('Check teams are draggable', async () => {
      expect(cardiffDrag).toBeInTheDocument()
      expect(swanseaDrag).toBeInTheDocument()
    })

    await step('Drag Cardiff 1 to Swansea 1 position', async () => {
      // pointer positions unreliable so use bounding rects to calculate positions
      const swanseaPos = swanseaDrag.getBoundingClientRect()
      const cardiffPos = cardiffDrag.getBoundingClientRect()
      const toCoords = {
        x: (swanseaPos.x + swanseaPos.width / 2) - cardiffPos.x,
        y: (swanseaPos.y + swanseaPos.height / 2) - cardiffPos.y,
      }
      await userEvent.pointer([
        { target: cardiffDrag, keys: '[MouseLeft>]' },
        { coords: toCoords },
        { keys: '[/MouseLeft]' },
      ])
    })

    await step('Check Cardiff 1 and Swansea 1 have swapped positions', async () => {
      expect(canvas.getByText("Swansea 1").parentElement).toHaveTextContent("1Swansea 1")
      expect(canvas.getByText("Cardiff 1").parentElement).toHaveTextContent("2Cardiff 1")
    })
  }
};

export const WithAdditionalAndOriginalSeeds: Story = {
  args: {
    seeds,
    originalSeeds: {
      ...seeds,
      mixed: seeds.mixed.toSpliced(0, 4, seeds.mixed[1], seeds.mixed[0]),
    },
    editable: true,
    onEdit: fn(),
  },
};
