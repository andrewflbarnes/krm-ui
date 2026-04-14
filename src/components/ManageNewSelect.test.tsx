import { describe, expect, it, vi } from 'vitest';
import { render as renderBase, within } from '@solidjs/testing-library'
import ManageNewSelect from './ManageNewSelect';
import { ClubSeeding } from '../kings';
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
  const onUpdate = vi.fn();
  const queries = renderBase(() => <ManageNewSelect onUpdate={onUpdate} config={initialConfig(numTeams)} />);

  return {
    ...queries,
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
    const { getByTestId, onUpdate } = render(3);
    const addClub = getByTestId('add-team')
    const addClubText = within(addClub).getByRole('textbox');
    const addClubButton = within(addClub).getByRole('button');

    expect(addClubText).toBeVisible();
    expect(addClubButton).toBeVisible();

    await userEvent.click(addClubText);
    await userEvent.type(addClubText, 'My New Team');
    await userEvent.click(addClubButton);

    expect(onUpdate).toHaveBeenCalledTimes(3);
    expect(onUpdate).toHaveBeenCalledWith('My New Team', 'mixed', 0);
    expect(onUpdate).toHaveBeenCalledWith('My New Team', 'ladies', 0);
    expect(onUpdate).toHaveBeenCalledWith('My New Team', 'board', 0);
  })
})
