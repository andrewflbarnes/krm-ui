import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@solidjs/testing-library'
import MiniLeague from './MiniLeague';
import { initRaces, initTeams } from '../test';
import { miniLeagueTemplates, Race } from '../kings';
import { createSignal } from 'solid-js';
import userEvent from '@testing-library/user-event';

/** Calculates the ordinal of a team for a given race i.e.
  * if we care about team 1 we check whether this appears first
  * in the team list (ordinal 1) or second (ordinal 2)
  */
const getTeamOrdinal = (teams: string[], race: Race, index: 1 | 2) => {
  const t1idx = teams.indexOf(race.team1)
  const t2idx = teams.indexOf(race.team2)
  return (index == 1 && t1idx < t2idx) || (index == 2 && t2idx < t1idx) ? 1 : 2
}

const user = userEvent.setup()

Object.entries(miniLeagueTemplates).forEach(([name, ml]) => {
  describe(`MiniLeague ${name}`, () => {
    const testTeams = initTeams(ml)
    const testRaces: Race[] = initRaces(ml)
    const renderMl = () => {
      const onResultChange = vi.fn()
      const [races, setRaces] = createSignal(testRaces)
      const queries = render(() => (
        <MiniLeague
          name={name}
          teams={testTeams}
          races={races()}
          onResultChange={onResultChange}
        />
      ))
      return {
        ...queries,
        races,
        setRaces,
        onResultChange,
      }
    }

    it('renders', () => {
      const { getByText } = renderMl()
      testTeams.forEach(team => expect(getByText(team)).toBeInTheDocument())
    })

    for (let i = 0; i < testRaces.length; i++) {
      [1, 2].forEach((team: 1 | 2) => {
        const race = testRaces[i]
        // we need to know which team is seeded first/second so we can click
        // on the correct test id
        const teamOrdinal = getTeamOrdinal(testTeams, race, team)
        const testId = `race-${testRaces[0].group}-${i}-${teamOrdinal}`
        describe(`recieves events for race ${i} team ${team}`, () => {

          const { findByText, getByTestId, onResultChange, setRaces, } = renderMl()

          beforeEach(() => {
            setRaces(testRaces)
            onResultChange.mockClear()
          })

          it('win', async () => {
            await user.click(getByTestId(testId))
            expect(onResultChange).toHaveBeenCalledOnce()
            expect(onResultChange).toHaveBeenCalledWith({
              ...testRaces[i],
              winner: team,
            })
          })

          it('dsq', async () => {
            await user.pointer({ keys: "[MouseRight]", target: getByTestId(testId) })
            const dsq = await findByText(/dsq/i)
            await user.click(dsq)
            expect(onResultChange).toHaveBeenCalledOnce()
            expect(onResultChange).toHaveBeenCalledWith({
              ...testRaces[i],
              [`team${team}Dsq`]: true,
            })
          })

          it('concede', async () => {
            await user.pointer({ keys: "[MouseRight]", target: getByTestId(testId) })
            const concede = await findByText(/concede/i)
            await user.click(concede)
            expect(onResultChange).toHaveBeenCalledOnce()
            expect(onResultChange).toHaveBeenCalledWith({
              ...testRaces[i],
              indicators: "by",
              team1Dsq: false,
              team2Dsq: false,
              winner: team == 1 ? 2 : 1,
            })
          })
        })
      })
    }

    it('can complete as expected', async () => {
      const { getByText, setRaces } = renderMl()
      for (let i = 0; i < testRaces.length; i++) {
        setRaces(races => races.map(r => ({
          ...r,
          winner: testTeams.indexOf(r.team1) < testTeams.indexOf(r.team2) ? 1 : 2,
        })))
        //await userEvent.click(getByTestId(`race-${testRaces[i].group}-${i}-1`))
      }
      expect(getByText(/1st/)).toBeInTheDocument()
      if (testTeams.length > 1) {
        expect(getByText(/2nd/)).toBeInTheDocument()
      }
      if (testTeams.length > 2) {
        expect(getByText(/3rd/)).toBeInTheDocument()
      }
      if (testTeams.length > 3) {
        expect(getByText(/4th/)).toBeInTheDocument()
      }
      if (testTeams.length > 4) {
        expect(getByText(/5th/)).toBeInTheDocument()
      }
      if (testTeams.length > 5) {
        expect(getByText(/6th/)).toBeInTheDocument()
      }
      expect(getByText("Complete")).toBeInTheDocument()
    })
  })
})
