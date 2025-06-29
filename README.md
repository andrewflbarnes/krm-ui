# Kings Results Manager

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5cffd5d-6924-4829-b7f3-3f5631b4c3b0/deploy-status)](https://app.netlify.com/sites/kings-krmui/deploys)

A (for now) completely client side runtime for running kings races.

## Getting Started

Install the deps and run the dev server

```bash
pnpm install
pnpm install -g netlify-cli
cat << EOF > .env
VITE_CLERK_PUBLISHABLE_KEY=...
EOF
netlify dev
```

## Optional functionality

To enable integration with clerk for user login and persistence to firestore,
add `VITE_CLERK_PUBLISHABLE_KEY` to your `.env` file.

## Config loading

The function for loading lead config scrapes data from the kingsski.club site -
it expects certain pages to exist by default but a custom URL may be given on
the teams page when updating.

## Build

To generate the static site
```bash
pnpm build
```

To test serving the build
```bash
netlify serve
```

## Storyboook

This project uses Storybook for component development and (some)
documentation/tests.

To run
```bash
pnpm storybook
```

## Testing

### E2E (playwright)

Tests focus on running a single round for each valid configuration
of teams
```bash
pnpm e2e
# or
pnpm e2e:ui
```

Full simulation tests work by assuming a local service is running (e.g. `netlify
dev`) and performing the below
- clearing local data
- loading wetern league config (for now config must be loaded to start racing)
- add a "Test" team
- add n mixed teams (as required for the test), 2 ladies and board (use 0 when
implemented)
- running a full round ensuring for each race the lowest numbered team wins
(e.g. Test 1 beats Test 2, 3, etc.)
- verifying the results are in numeric order e.g. 1st Team 1, 2nd Team 2, ...
nth Team n

This makes several hard assumptions including
- Config supports that if each team always beat lower seeded teams in races, the
results will be ordered by seeding
- For teams without any results, within a club, they are seeded by lowest number
first
- There is no "Test" team in pulled config

### Unit (vitest)

This project has a focus on testing Kings related configuration by dynamically
generating high coverage, fine grained checks deterministically.

This should allow new and updated configurations to be easily validated with a
high degree of confidence.

Locally, tests can be run with the below and automatically start in watch mode.
```bash
pnpm test
```

## TODOs/Backlog

These lists are intended to be terse but describe what complete looks like.
Lists are in a rough order of priority.

[Tech](./docs/TODO_TECH.md)  
[Features](./docs/TODO_FEATURES.md)
