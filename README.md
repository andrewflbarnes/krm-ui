# Kings Results Manager

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5cffd5d-6924-4829-b7f3-3f5631b4c3b0/deploy-status)](https://app.netlify.com/sites/kings-krmui/deploys)

A (for now) completely client side runtime for running kings races.

## Getting Started

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

To enable config to be loaded from Kings tracking sheets add the published
endpoint and relevant cell ranges as `TRACKER_WESTERN` to your `.env` file.
The tracker depends on a netlify function to proxy the request which allows us
to keep the URL a secret in deployed environments. You can run the full stack
using the `netlify` cli tool.

```bash
npm i -g netlify
netlify dev
```

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

This project uses Storybook for component development and (some) documentation/tests.

To run
```bash
pnpm storybook
```

## Testing

This project has a focus on testing Kings related configuration by dynamically generating
high coverage, fine grained checks deterinistically.

This should allow new and updated configurations to be easily validated with a high
degree of confidence.

Locally, tests can be run with the below and automatically start in watch mode.
```bash
pnpm test
```

## TODOs/Backlog

These lists are intended to be terse but describe what complete looks like.
Lists are in a rough order of priority.

[Tech](./docs/TODO_TECH.md)  
[Features](./docs/TODO_FEATURES.md)
