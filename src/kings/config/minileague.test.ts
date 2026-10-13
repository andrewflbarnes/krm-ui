import { describe, expect, it } from 'vitest';
import { miniLeagueTemplates } from './minileague';

describe.each(Object.entries(miniLeagueTemplates))('mini league template %s', (name, template) => {
  const numTeams = template.teams

  const numRaces = (function() {
    switch (name) {
      case "full4":
        return 12
      case "full3":
        return 6
      case "full2":
        return 3
      default:
        return (numTeams * (numTeams - 1)) / 2
    }
  })()
  it(`has ${numRaces} races`, () => {
    expect(template.races.length).toBe(numRaces)
  })

  const numTeamRaces = (function() {
    switch (name) {
      case "full4":
        return 6
      case "full3":
        return 4
      case "full2":
        return 3
      default:
        return numTeams - 1
    }
  })()
  for (let i = 0; i < numTeams; i++) {
    it(`team ${i + 1} has ${numTeamRaces} races`, () => {
      expect(template.races.filter(r => r[0] == i || r[1] == i).length).toBe(numTeamRaces)
    })
  }

  it('no races with same team', () => {
    expect(template.races.filter(r => r[0] == r[1]).length).toBe(0)
  })
})
