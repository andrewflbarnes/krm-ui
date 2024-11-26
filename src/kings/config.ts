export type LeagueConfig = {
  name: string;
  tracker?: string;
}

const config = {
  western: {
    name: "Western",
    tracker: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRVRr4PgIw99JJ5ez9fFmfmLHwUTm5c-BYHpEsztFg2k3P2PCPe5yj0q2dzDUvx0qoUmkZl5B8gkfC4/pub?gid=0&single=true&output=csv&range=A6:K100',
  },
  midlands: {
    name: "Midlands",
  },
  northern: {
    name: "Northern",
  },
  southern: {
    name: "Southern",
  },
} as const

export type League = keyof typeof config

export const divisions = ["mixed", "ladies", "board"] as const

export type Division = typeof divisions[number]

const typedConfig: Record<League, LeagueConfig> = config
export default typedConfig

export const leagues: League[] = Object.keys(config) as League[]
