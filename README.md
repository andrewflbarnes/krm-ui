# Kings Results Manager

A (for now) completely client side runtime for running kings races.

## Getting Started

```bash
pnpm install
pnpm start
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

## Notes

The various plugins for vite are currently downgraded as a results of a bug
in `vite-solid-plugin >= 2.2.x`. An issue has been raised [here][vite-build-bug].

[vite-build-bug]: https://github.com/solidjs/vite-plugin-solid/issues/164
