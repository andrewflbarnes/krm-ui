import { Race } from "../kings"

export const races: Race[] = [
  { group: "1st/2nd", team1: "Bath 1", team2: "Bristol 1", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 0, },
  { group: "3rd/4th", team1: "Bath 2", team2: "Bristol 2", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 1, },
  { group: "5th/6th", team1: "Bath 3", team2: "Bristol 3", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 2, },
  { group: "7th/8th", team1: "Bath 4", team2: "Bristol 4", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 3, },
  { group: "9th/10th", team1: "Aberystwyth 1", team2: "Plymouth 1", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 4 },
  { group: "11th/12th", team1: "Aberystwyth 2", team2: "Plymouth 2", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 5 },
  { group: "13th/14th", team1: "Aberystwyth 3", team2: "Plymouth 3", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 6 },
  { group: "15th/16th", team1: "Aberystwyth 4", team2: "Plymouth 4", teamMlIndices: [0, 1], division: "mixed", stage: "stage1", groupRace: 7 },
]

export const knockouts = [ ...races ].reverse().map((r, i) => ({ ...r, groupRace: i }))

