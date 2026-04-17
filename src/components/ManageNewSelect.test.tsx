import { describe, expect, it, vi } from 'vitest';
import { render as renderBase } from '@solidjs/testing-library'
import ManageNewSelect from './ManageNewSelect';
import { ClubSeeding } from '../kings';

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
})
