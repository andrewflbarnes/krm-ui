import { describe, expect, it } from 'vitest';
import { miniLeagueTemplates, raceConfig } from './config';

// TODO testing to validate the below i.e.
// - r1: the total count of teams matches the count key
// - r1: each mini league has a unique team name
// - r1: there are no duplicate seeds across round 1
// - r2: the total count of teams matches the count key
// - r2: each mini league has a unique team name
// - r2: the mini league is for the same number of teams as appear in the seeds
// - r2: there are no duplicate r1 references across round 2
// - ko: there are no diplicate r2 references across knockouts
describe.each(Object.entries(miniLeagueTemplates))('mini league template %s', (name, template) => {
  const numTeams = template.teams

  const numRaces = name == "full3" ? 6 : (numTeams * (numTeams - 1)) / 2
  it(`has ${numRaces} races`, () => {
    expect(template.races.length).toBe(numRaces)
  })

  const numTeamRaces = name == "full3" ? 4 : numTeams - 1
  for (let i = 1; i <= numTeams; i++) {
    it(`team ${i} has ${numTeamRaces} races`, () => {
      expect(template.races.filter(r => r[0] == i || r[1] == i).length).toBe(numTeamRaces)
    })
  }

  it('no races with same team', () => {
    // @ts-expect-error ts thinks r is always [1, 2]
    expect(template.races.filter(r => r[0] == r[1]).length).toBe(0)
  })
})

describe.each(Object.entries(raceConfig))('race config for %d teams', (numTeamsStr, config) => {
  const numTeams = parseInt(numTeamsStr) >>> 0
  for (let i = 1; i <= numTeams; i++) {
    it(`team ${i} seeded in stage 1`, () => {
      expect(config.stage1.some(group => group.seeds.some(s => s.position == i))).toBe(true)
    })
  }

  config.stage1.forEach(group => {
    it(`stage 1 group ${group.name} for ${group.seeds.length} teams has correct size template`, () => {
      expect(group.seeds.length).toBe(group.template.teams)
    })
  })

  if (numTeams < 7) {
    it('no stage 2', () => {
      expect(config.stage2).toBeUndefined()
    })
    it('no knockout stage', () => {
      expect(config.knockout).toBeUndefined()
    })
  } else {
    config.stage2.forEach(group => {
      it(`stage 2 group ${group.name} for ${group.seeds.length} teams has correct size template`, () => {
        expect(group.seeds.length).toBe(group.template.teams)
      })
    })

    it(`stage 2 has ${numTeams} seeds`, () => {
      expect(config.stage2.reduce((acc, group) => acc + group.seeds.length, 0)).toBe(numTeams)
    })

    config.stage1.forEach(group => {
      for (let i = 1; i <= group.seeds.length; i++) {
        it(`group ${group.name} team ${i} seeded in stage2`, () => {
          expect(config.stage2.some(s2group => s2group.seeds.some(s => s.position == i && s.group == group.name))).toBe(true)
        })
      }
    })

    if (numTeams > 8) {
      config.knockout.forEach(group => {
        it(`knockouts for ${group.name} teams has correct size template`, () => {
          expect(group.seeds.length).toBe(group.template.teams)
        })
      })

      config.knockout.forEach(ko => {
        ko.seeds.forEach(({ group: groupName, position }) => {
          it(`knockout from group ${groupName} position ${position} is valid`, () => {
            // TODO knockouts could come from stage 1?
            expect(config.stage2.some(group => group.name == groupName && group.seeds.length >= position)).toBe(true)
          })
        })
      })
    }
  }

  config.results.forEach(({ stage, position, group: groupName }) => {
    it(`result from group ${groupName} position ${position} is valid`, () => {
      expect(config[stage]?.some(group => group.name == groupName && group.seeds.length >= position)).toBe(true)
    })
  })
})
