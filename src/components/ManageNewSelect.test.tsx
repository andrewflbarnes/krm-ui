import { describe, expect, it, vi } from 'vitest';
import { render as renderBase, within } from '@solidjs/testing-library'
import ManageNewSelect from './ManageNewSelect';
import { ClubSeeding } from '../kings';
import { createSignal } from 'solid-js';
import userEvent from '@testing-library/user-event';

const initialConfig = (numTeams: number = 0): ClubSeeding => ['Bath', 'Bristol', 'Plymouth', 'Aberystwyth'].reduce((acc, club) => {
  acc[club] = {
    mixed: numTeams,
    ladies: numTeams,
    board: numTeams,
  }
  return acc
}, {} as ClubSeeding);


const render = (numTeams: number = 0) => {
  const [config, setConfig] = createSignal<ClubSeeding>(initialConfig(numTeams));
  const onUpdate = vi.fn();
  const handleUpdate = (newConfig: ClubSeeding) => {
    setConfig(newConfig);
    onUpdate(newConfig);
  }
  const queries = renderBase(() => <ManageNewSelect onUpdate={handleUpdate} config={config()} />);

  return {
    ...queries,
    config,
    onUpdate,
  }
}

describe('ManageNewSelect', () => {
  it('renders', () => {
    const { getByText } = render();
    ['Bath', 'Bristol', 'Plymouth', 'Aberystwyth'].forEach(club => {
      expect(getByText(club)).toBeInTheDocument();
    });
  })

  it('shows error if no teams', () => {
    const { getByText } = render(0);
    expect(getByText('Errors')).toBeInTheDocument();
  })

  it("shows error if config doesn't exist", () => {
    const { getByText } = render(10);
    expect(getByText('Errors')).toBeInTheDocument();
  })

  it("shows no error if config exists", () => {
    const { queryByText } = render(3);
    expect(queryByText('Errors')).not.toBeInTheDocument();
  })

  it("can add new team", async () => {
    const { getByTestId, findByRole } = render(3);
    const addClub = getByTestId('add-team')
    const addClubText = within(addClub).getByRole('textbox');
    const addClubButton = within(addClub).getByRole('button');

    expect(addClubText).toBeVisible();
    expect(addClubButton).toBeVisible();

    await userEvent.click(addClubText);
    await userEvent.type(addClubText, 'Test');
    await userEvent.click(addClubButton);


    expect(await findByRole('cell', { name: 'Test' })).toBeInTheDocument();
    expect(within(addClub).queryByText('Test')).not.toBeInTheDocument();
  })
})
