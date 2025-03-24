import { describe, expect, it } from 'vitest';
import { miniLeagueTemplates, raceConfig } from './config';

describe.each(Object.entries(miniLeagueTemplates))('mini league template %s', (name, template) => {
  const numTeams = template.teams

  const numRaces = (function() {
    switch (name) {
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
    // @ts-expect-error ts thinks r is always [1, 2]
    expect(template.races.filter(r => r[0] == r[1]).length).toBe(0)
  })
})

describe.each(Object.entries(raceConfig))('race config for %d teams', (numTeamsStr, config) => {
  const numTeams = parseInt(numTeamsStr) >>> 0
  it(`number of seeded teams in stage 1 is ${numTeams}`, () => {
    const seededTeams = config.stage1.flatMap(group => group.seeds)
      .filter((seed, idx, arr) =>
        arr.findIndex(s => s.position == seed.position && s.group == seed.group) == idx)
    expect(seededTeams.length).toBe(numTeams)
  })

  it(`stage 1 mini leagues have distinct team names`, () => {
    const groupNames = config.stage1.map(({ name }) => name)
      .filter((name, idx, arr) => arr.indexOf(name) == idx)
    expect(groupNames.length).toBe(config.stage1.length)
  })

  for (let i = 0; i < numTeams; i++) {
    it(`team ${i + 1} seeded in stage 1`, () => {
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

    it(`number of seeded teams in stage 2 is ${numTeams}`, () => {
      const seededTeams = config.stage2.flatMap(group => group.seeds)
        .filter((seed, idx, arr) =>
          arr.findIndex(s => s.position == seed.position && s.group == seed.group) == idx)
      expect(seededTeams.length).toBe(numTeams)
    })

    it(`stage 2 mini leagues have distinct team names`, () => {
      const groupNames = config.stage2.map(({ name }) => name)
        .filter((name, idx, arr) => arr.indexOf(name) == idx)
      expect(groupNames.length).toBe(config.stage2.length)
    })

    config.stage1.forEach(group => {
      for (let i = 0; i < group.seeds.length; i++) {
        it(`group ${group.name} team ${i + 1} seeded in stage2`, () => {
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

      it(`knocckout mini leagues have distinct team names`, () => {
        const groupNames = config.knockout.map(({ name }) => name)
          .filter((name, idx, arr) => arr.indexOf(name) == idx)
        expect(groupNames.length).toBe(config.knockout.length)
      })

      // Slighlty different from stage 1 and 2 as knockouts don't necessarily
      // include all teams for the round
      it(`knockout seeds are distinct`, () => {
        const numSeededTeams = config.knockout.reduce((acc, group) => acc + group.seeds.length, 0)
        const distinctSeededTeams = config.knockout.flatMap(group => group.seeds)
          .filter((seed, idx, arr) =>
            arr.findIndex(s => s.position == seed.position && s.group == seed.group) == idx)
        expect(distinctSeededTeams.length).toBe(numSeededTeams)
      })

      config.knockout.forEach(ko => {
        ko.seeds.forEach(({ group: groupName, position }) => {
          it(`knockout from group ${groupName} position ${position} is valid`, () => {
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

  it(`results are distinct`, () => {
    const results = config.results.filter((result, idx, arr) =>
      arr.findIndex(r => r.stage == result.stage && r.group == result.group && r.position == result.position) == idx)
    expect(results.length).toBe(config.results.length)
  })
})
