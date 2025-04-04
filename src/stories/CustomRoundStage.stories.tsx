import { batch } from 'solid-js';
import type { Meta, StoryObj } from 'storybook-solidjs';
import CustomRoundStage from '../components/CustomRoundStage';
import { useCreateRoundConfig } from '../hooks/create-config';

const meta = {
  title: 'kings/CustomRoundStage',
  component: CustomRoundStage,
  render: (props) => {
    const {
      addMiniLeague,
      changeName,
      setConfig,
      setResultsConfig,
      addKnockout,
    } = useCreateRoundConfig()
    batch(() => {
      setConfig("stage1", undefined)
      const mlkey = addMiniLeague("stage1", "mini4", 4)
      changeName("stage1", mlkey, "A")
      setConfig("stage2", undefined)
      const mlkey2 = addMiniLeague("stage2", "mini4", 4)
      changeName("stage2", mlkey2, "I")
      setConfig("knockout", undefined)
      setResultsConfig("seeds", [])
      addKnockout(0, "1st/2nd")
    })
    return <CustomRoundStage {...props} />
  },
} satisfies Meta<typeof CustomRoundStage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stage1: Story = {
  args: {
    stage: "stage1",
  }
}

export const Stage2: Story = {
  args: {
    stage: "stage2",
  }
}

export const Knockout: Story = {
  args: {
    stage: "knockout",
  }
}
