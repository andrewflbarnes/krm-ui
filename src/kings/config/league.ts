export const leagues = ["western", "midlands", "southern", "northern", "scotland"] as const

export type League = typeof leagues[number];

export type LeagueConfig = {
  name: string;
  venues: readonly string[];
}

export const leagueConfigs = {
  western: {
    name: "Western",
    venues: [
      "Gloucester",
      "Pembrey",
      "Plymouth",
    ],
  },
  midlands: {
    name: "Midlands",
    venues: [
      "Ackers",
    ],
  },
  northern: {
    name: "Northern",
    venues: [
      "Rossendale",
      "Sunderland",
    ],
  },
  southern: {
    name: "Southern",
    venues: [
      "Aldershot",
      "Brentwood",
      "Southampton",
    ],
  },
  scotland: {
    name: "Scotland",
    venues: [
      "Bearsdem",
      "Bellahouston",
      "Garthdee",
    ],
  },
} as const satisfies Record<League, LeagueConfig> as Record<League, LeagueConfig>
