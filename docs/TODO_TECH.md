# TODO: Tech

## Completed

- [x] Downgrade to vite-solid-plugin 2.1.0
- [x] Deploy to GitHub pages
- [x] Upgrade vite-solid-plugin when [fix is available][vite-build-bug]
- [x] Refactor to a common model for in progress race list and mini league views
- [x] Deploy to andrewflbarnes.com
- [x] Protect sensitive variables with serverless function calls
- [x] Playwright tests for all round configurations
- [x] ManageNewSelect should be uncontrolled with event emits - reduce duplice update implementations

## Must

- [ ] Transition all arrays of arrays to objects of arrays or arrays of obejcts for simpler firestore integration, easier to read code
- [ ] Replace KingsContext with global signals - maybe bad idea as "computations created outside a `createRoot` or `render` will never be disposed"
- [ ] Transition all "api" interactions to tanstack query and async
- [ ] Align how RoundConfigs are passed to create/progress/complete
- [ ] Verify stage 2 should always have same number of teams as stage 1
- [ ] Validation checks when re-opening a stage
- [ ] Service worker for offline use
- [ ] Responsive layout
- [ ] Place some sensible error boundaries in, at least at a page level

## Should

- [ ] Use actual drawer component for nav
- [ ] playwright - add description, venue, etc. in info step
- [ ] playwright - validate missing teams
- [ ] playwright - validate team swap
- [ ] playwright - perform team swap
- [ ] playwright - validate summary
- [ ] For unknown leagues display an error message/page
- [ ] Rationalise utility functions like orderRaces, kingsPoints
- [ ] Deploy to kingsski.club
- [ ] Online data sync
- [ ] Consistent, sensible boundaries of responsiblity between context and api
- [ ] Throw error if attempting to change league when lock in place in setLeagueEnhanced
- [ ] Throw error if attempting to change to an invalid league in setLeagueEnhanced

[vite-build-bug]: https://github.com/solidjs/vite-plugin-solid/issues/164
