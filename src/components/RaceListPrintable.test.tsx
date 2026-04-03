import { describe, expect, it } from 'vitest';
import { render } from '@solidjs/testing-library';
import RaceListPrintable from './RaceListPrintable';
import { Race } from '../kings';

const mockRaces: Race[] = [
  {
    division: 'mixed',
    group: '1',
    stage: 'stage1',
    groupRace: 0,
    teamMlIndices: [0, 1],
    team1: 'Team Alpha',
    team2: 'Team Beta',
  },
  {
    division: 'mixed',
    group: '2',
    stage: 'stage1',
    groupRace: 1,
    teamMlIndices: [2, 3],
    team1: 'Team Gamma',
    team2: 'Team Delta',
  },
];

const mockKnockoutRaces: Race[] = [
  {
    division: 'mixed',
    group: '1st/2nd',
    stage: 'knockout',
    groupRace: 0,
    teamMlIndices: [0, 1],
    team1: 'Team Alpha',
    team2: 'Team Beta',
  },
  {
    division: 'mixed',
    group: '3rd/4th',
    stage: 'knockout',
    groupRace: 1,
    teamMlIndices: [2, 3],
    team1: 'Team Gamma',
    team2: 'Team Delta',
  },
];

describe('RaceListPrintable', () => {
  it('renders without crashing', () => {
    const { container } = render(() => <RaceListPrintable races={[]} />);
    expect(container).toBeInTheDocument();
  });

  it('displays the title and subtitle correctly', () => {
    const title = 'My Race List';
    const subtitle = 'Round 1';
    const { getByText } = render(() => <RaceListPrintable races={mockRaces} title={title} subtitle={subtitle} />);
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
  });

  it('displays race data correctly in non-knockout mode', () => {
    const { getByText, getAllByText } = render(() => <RaceListPrintable races={mockRaces} />);

    expect(getAllByText('M').length).toBe(2); // Division
    expect(getByText('1')).toBeInTheDocument(); // Race number
    expect(getByText('Team Alpha')).toBeInTheDocument();
    expect(getByText('Team Beta')).toBeInTheDocument();

    expect(getByText('2')).toBeInTheDocument(); // Race number
    expect(getByText('Team Gamma')).toBeInTheDocument();
    expect(getByText('Team Delta')).toBeInTheDocument();
  });

  it('displays race data correctly in knockout mode', () => {
    const { getByText, getAllByText } = render(() => <RaceListPrintable races={mockKnockoutRaces} knockouts={true} />);

    expect(getAllByText('M').length).toBe(2); // Division
    expect(getByText('1st/2nd')).toBeInTheDocument(); // Race number
    expect(getByText('Team Alpha')).toBeInTheDocument();
    expect(getByText('Team Beta')).toBeInTheDocument();

    expect(getByText('3rd/4th')).toBeInTheDocument(); // Race number
    expect(getByText('Team Gamma')).toBeInTheDocument();
    expect(getByText('Team Delta')).toBeInTheDocument();
  });

  it('does not display subtitle if not provided', () => {
    const title = 'My Race List';
    const { getByText, queryByText } = render(() => <RaceListPrintable races={mockRaces} title={title} />);
    expect(getByText(title)).toBeInTheDocument();
    expect(queryByText('Round 1')).not.toBeInTheDocument(); // Assuming 'Round 1' was a potential subtitle
  });
});
