import type { Meta, StoryObj } from 'storybook-solidjs';
import { ComponentProps, createEffect, createSignal, untrack } from "solid-js";
import { MiniLeagueTemplate, miniLeagueTemplates, Race } from "../kings";
import MiniLeague from '../components/MiniLeague';
import { expect, fn, userEvent, waitFor } from '@storybook/test';
import { initRaces, initTeams } from '../test';

// Identical to above but reverse the teams to ensure rendering isn't affected
function initRacesInverse(mlt: MiniLeagueTemplate): Race[] {
  return initRaces(mlt).map(r => ({
    ...r,
    team1: r.team2,
    team2: r.team1,
  }))
}

const MiniLeagueWithHandler = (props: ComponentProps<typeof MiniLeague>) => {
  const [races, setRaces] = createSignal<Race[]>(untrack(() => props.races))
  createEffect(() => {
    setRaces(props.races)
  })
  const handleResultChange = (result: Race) => {
    const newRaces = [...races()]
    newRaces[result.groupRace] = result
    console.log("Received result change event: " + JSON.stringify(result))
    setRaces(newRaces)
    props.onResultChange(result)
    //notification.info("Received result change event: " + JSON.stringify(result))
  }
  return <MiniLeague {...props} onResultChange={handleResultChange} races={races()} />
}

const meta = {
  title: 'Kings/MiniLeague',
  render: props => <MiniLeagueWithHandler {...props} />,
  component: MiniLeague,
  argTypes: {
    live: { control: 'boolean' },
    collapsed: { control: 'boolean' },
    readonly: { control: 'boolean' },
  },
  args: {
    onResultChange: fn(),
  },
  play: async ({ args, canvas, step }) => {
    await step('Set winner of all races to the first team', async () => {
      for (let i = 0; i < args.races.length; i++) {
        await userEvent.click(canvas.getByTestId(`race-${args.races[i].group}-${i}-1`))
      }
    })
    await waitFor(() => expect(canvas.getByText(/1st/)).toBeInTheDocument())
    await waitFor(() => expect(canvas.getByText(/2nd/)).toBeInTheDocument())
    await waitFor(() => expect(canvas.getByText(/3rd/)).toBeInTheDocument())
    if (args.teams.length > 3) {
      await waitFor(() => expect(canvas.getByText(/4th/)).toBeInTheDocument())
    }
    if (args.teams.length > 4) {
      await waitFor(() => expect(canvas.getByText(/5th/)).toBeInTheDocument())
    }
    if (args.teams.length > 5) {
      await waitFor(() => expect(canvas.getByText(/6th/)).toBeInTheDocument())
    }
    await waitFor(() => expect(canvas.getByText("Complete")).toBeInTheDocument())
    await waitFor(() => expect(args.onResultChange).toHaveBeenCalledTimes(args.races.length))
  }
} satisfies Meta<typeof MiniLeague>;
export default meta;

type Story = StoryObj<typeof meta>;

const m3 = miniLeagueTemplates.mini3
export const Teams3: Story = {
  args: {
    name: "Mini 3",
    teams: initTeams(m3),
    races: initRaces(m3),
  },
}

const m4 = miniLeagueTemplates.mini4
export const Teams4: Story = {
  args: {
    name: "Mini 4",
    teams: initTeams(m4),
    races: initRaces(m4),
  },
}

/**
  * Ensure that when teams are on other sides of the course, the rendering is correct
  */
export const TeamsInverse4: Story = {
  args: {
    name: "Mini 4 Inverse",
    teams: initTeams(m4),
    races: initRacesInverse(m4),
  },
}

/**
  * Make races share columns where possible
  */
export const TeamsCollapse4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Collapsed",
    collapsed: true,
  },
}

/**
  * Readonly mini leagues can't be updated
  */
export const TeamsReadonly4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Readonly",
    readonly: true,
  },
  play: async ({ args, canvas, step }) => {
    step('Try to set winner of all races to the first team', async () => {
      for (let i = 0; i < args.races.length; i++) {
        await userEvent.click(canvas.getByTestId(`race-${args.races[i].group}-${i}-1`))
      }
    })
    await waitFor(() => expect(canvas.queryByText(/1st/)).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.queryByText(/2nd/)).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.queryByText(/3rd/)).not.toBeInTheDocument())
    await waitFor(() => expect(canvas.queryByText(/4th/)).not.toBeInTheDocument())
    await waitFor(() => expect(args.onResultChange).not.toHaveBeenCalledTimes(args.races.length))
  },
}

/**
  * Live mini leagues will show positions as soon as once race has occurred
  */
export const TeamsLive4: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 Live",
    live: true,
  },
  play: async ({ args, canvas, step }) => {
    await step('Set first race winner', async () => {
      await userEvent.click(canvas.getByTestId('race-Z-0-1'))
    })
    await waitFor(() => expect(canvas.getByText(/1st/)).toBeInTheDocument())
    await waitFor(() => expect(args.onResultChange).toHaveBeenCalledOnce())
  }
}

/**
  * Disable results info on RHS
  */
export const NoResults: Story = {
  args: {
    ...Teams4.args,
    name: "Mini 4 No Results",
    noResults: true,
  },
}

const m5 = miniLeagueTemplates.mini5
export const Teams5: Story = {
  args: {
    name: "Mini 5",
    teams: initTeams(m5),
    races: initRaces(m5),
  },
}

const m6 = miniLeagueTemplates.mini6
export const Teams6: Story = {
  args: {
    name: "Mini 6",
    teams: initTeams(m6),
    races: initRaces(m6),
  },
}

const f3 = miniLeagueTemplates.full3
export const Full3: Story = {
  args: {
    name: "Full 3",
    teams: initTeams(f3),
    races: initRaces(f3),
  },
}

const ko = miniLeagueTemplates.knockout
export const Knockout: Story = {
  args: {
    name: "Knockout",
    teams: initTeams(ko),
    races: initRaces(ko),
  },
}
