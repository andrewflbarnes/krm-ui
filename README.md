# Kings Results Manager

[![Netlify Status](https://api.netlify.com/api/v1/badges/e5cffd5d-6924-4829-b7f3-3f5631b4c3b0/deploy-status)](https://app.netlify.com/sites/kings-krmui/deploys)

A (for now) completely client side runtime for running kings races.

## Getting Started

```bash
pnpm install
pnpm start
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

You can test serving it using the below which will include configuration to
perform path rewrites allowing deep linking into the client side router.
```bash
pnpm serve
```

## TODOs/Backlog

These list are intended to be terse but describe what complete looks like.
Lists are in a rough order of priority.

[Tech](./docs/TODO_TECH.md)  
[Features](./docs/TODO_FEATURES.md)
