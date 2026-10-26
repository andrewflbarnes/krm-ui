# Changelog

All notable changes to this project will be documented in this file.

## [0.8.0] - 2026-10-26

### 🚀 Features

- Show new indicator and movement in seeding
- Start adding persistence for race setup
- Easier palette management, new colors
- Add race information to shuffle step
- Add optional titles to setup
- Use number badge for race list, fix bgcolor
- Use groupcard for minileagues, prevent content jumping
- Add race numbers to minileagues

### 🐛 Bug Fixes

- Prevent unnecessary, frequent user writes
- Correct stage1/mixed/primary alignment and mode swapping
- Prevent lint warning
- Navigating to different league resets team setup
- Consistent application of new seeds in race seeding
- Reset seeds when round created, reset original if teams changed
- Correct minileague columns when collapsed, add win/pos header cells

### 🎨 Styling

- Slightly more muted red
- Align shuffle reset with theme
- Improve layout on shuffle when flex wrapping occurs

### 🧪 Testing

- Get minileagues by test id, address some formatting
- Remove timeout override

### ⚙️ Miscellaneous Tasks

- Improve appbar styling on small screens
- Remove custom color code, move to MUI theme
- Better naming of files
- Use absolute alias imports
- Make race steps use test id instead of unused title
- Add test:smoke convenience script
- Remove redundant strong tag

## [0.7.0] - 2026-10-24

### 🚀 Features

- Add firestore emulation support
- Add firestore rules, fix incorrect placeholder in notification
- Use consistent, declarative firestore rules
- Simplify new round setup and identification of new teams
- Add experimental takeover, move reset data to dev tools

### 🐛 Bug Fixes

- IsNew should be optional on teams

### ⚙️ Miscellaneous Tasks

- Improvements to seeding, standardise stagecard use, fix typo
- Update git ignore

## [0.6.0] - 2026-10-22

### 🚀 Features

- Update configuration to current
- Environment scoping for firebase (bit janky for now)
- Allow seeding to be modified
- Start adding seeding shuffle to race new flow

### 🐛 Bug Fixes

- Remove bad config on 8 teams
- Add forgotten file...
- Get league data/config when deep linking and navving
- Fix tsc errors from unused imports

### 🧪 Testing

- Add vitest integration to storybook and cleanup a little

### ⚙️ Miscellaneous Tasks

- Refactor configuration and utils so easier to make sense of
- Better config button descriptions
- Some better error messages when fetching config
- Start decoupling api, storage, persistence, reactivity
- More localstorage decoupling

## [0.5.0] - 2026-10-13

### 🚀 Features

- Add responsive app bar drawer for small screens and mobile
- Only show reset actions if something to reset
- Align option switches in layout
- Add full4 configuration, fix typing

### 🐛 Bug Fixes

- Remove unused prop causing ts errors
- Correct full4 side alternation

### 🧪 Testing

- Improve coverage of result utils
- Add stringutils test
- Add round-utils tests, fix stage checking and unfinished bug

### ⚙️ Miscellaneous Tasks

- Fix styling in small screens for external dev links
- Collapsible round details on small screens
- Make it obvious printing is blocking the UI
- Fix opacity problems on print blocking modal
- Simplify download button text
- Publish playwright report to tigris
- Correct e2e flow
- Split e2e run from upload
- Update playwright report bucket and host
- Fix environment variables refs in upload/download artifact
- Minor visual improvements to drawer
- Dependency updates
- More dependency updates - mainly linting related
- More dep updates - playwright and utility libs
- Update firebase dependency and some others
- Update solidjs router to release 1
- Update netlify function deps
- Update latest clerk deps
- Remove netlify lighthouse plugin

## [0.4.0] - 2026-05-01

### 🚀 Features

- Add buttons to reset team shuffles
- Keep manually added teams when loading league config
- Add venue dropdown to new races, add season field
- Save season to race details, reset venue when changing league
- Add better experimental and developer flag support

### 🐛 Bug Fixes

- Prevent scroll clipping on round select, add missing paper
- Border radius on main element and footer removed
- Footer/layour opacity
- Render team being dragged in shuffle phase
- Don't combine league teams on selection when league changed
- Ensure loaded status of league config cleared when reset
- Allow scrolling when dragging a team in shuffle
- Ensure division and group ordering correct in minileagues
- Correctly calculate results html based on round number
- Add jotai-utils file missed from feature flag improvements
- Ensure menu closes after awarding by on race list

### 📚 Documentation

- Update done/rejected todos
- Add todo - local caching with jotai
- Add scroll bug

### 🎨 Styling

- Modernisation and visual improvements
- Moderinsation and visual improvements to config
- Prettier team selection on new races
- Modernise config round
- Modernise config minileague
- Modernise race results
- Modernise minileague
- Move total teams number next to corresponding text
- Prevent layout change when shuffle movement chip shown
- More consistent theming
- Use drag indicator as icon for shuffling
- Better visual indicators of droppable items in shuffle
- Fix header/footer radius regression
- More consistent paper/card use, some layout fixes
- Better responsive layout for shuffle groups in columns
- Udpate theme color
- Remove unnecessary detail title taking up space when small
- Remove total team count - clutter, takes up space
- Modernise update teams component, factor out stage card
- Config sidebar fully expand/collapse on small screens
- Slightly lighter primary color in light mode
- Align seeding styles with rest of app

### 🧪 Testing

- Fix RunRaceResults storybook, change joint rendering to "="
- Include smoke test of teams on deploy, deploy report
- Prevent kings state/jotai leaking into test context
- More realistic test scenario for playwright, include ci link

### ⚙️ Miscellaneous Tasks

- Include env in non production versions
- Consolidate config layout and sidebar
- Cleanup minileague
- Consolidate the detail and selection setup steps
- Move new detail out to own component
- Stepper own component, sync storybook bg to mui theme, theme hook
- Dont use deprecated write function on document
- Always render Paper as a base to storybook
- Minor reactive updates
- Refactor common group card out, re-use in shuffle
- Fix cliff config to pick up sec messages
- Correct league venues
- Remove commented out code
- Fix storybook with season field, false positive oxlint refs
- Reduce background opacity in light mode
- Factor out colors, make new setup more responsive
- Refactor out manage select footer, fix tests
- Fix playwright, don't render second select at all
- Actually use select footer, fix height on PWA/mobile
- Cleanup unused imports
- Show error when fetching races fail
- Consolidate shuffle and seeding into confirm
- Fix scheduled e2e
- Playwright and storybook in krm
- Fix performance of race list
- /dev/null easter egg
- Add manage new seeding stories
- Correct smoke test command
- Remove playwright trace
- Address some accessibility issues
- Minor performance improvement for initial page load
- Add robots.txt and consolidate index.css files
- Update robots.txt
- Include internet archive bot in robots.txt

### 🛡️ Security

- Upgrade axios to address critical dependabot alerts
- Upgrade cheerio for dependabot, fix ci e2e permission
- Update vite for dependabot

## [0.3.0] - 2026-04-06

### 🚀 Features

- Refresh management/racing navigation
- Aadd MiniLeagues component
- Upgrade storybook to 10 and include in deployment
- Show download/create card when no existing races
- Improved UX around navigation on races and config

### 🐛 Bug Fixes

- Changing league now updates visibility of continue race button
- Determine printable knockouts from stage, not status
- Ensure we get download data from server, not cache
- Github logo reacts to mui theme
- Lock race creation during team selection
- Race count validation on minileagues for 1 team
- Correct playwright fixture after nav changes
- Move back to typescript 5, disable some false oxlint rules
- Remove storybook testing
- Update selected league in dev data, minor formatting changes
- Handle non-existent races better
- State that the user should try refreshing if races not found
- Correct navigation after renames, rename more pages
- Pass error in rej
- Use jotai for global state management

### 📚 Documentation

- Move a couple of features to done

### 🧪 Testing

- Add printable tests

### ⚙️ Miscellaneous Tasks

- Show teams alphabetically in new race select
- Make create round config more obviously experimental
- Use pnpm exec instead of npm to align with package manager
- Update to node 22
- Build command cleanup
- Change continue button on homepage to view/continue
- Further restrict pwa/sw creation, correct icon moves
- Move/rename files after nav refactor
- Remove unnecessary logic, fix a nav, fix non-existent race
- Consistent button to load league config
- Add retries to parallel playwright runs
- Better visual distinction between config options
- More ux consistency around buttons and creating new races
- Shuffle footer around, change theme icon as required
- Update github actions to latest versions

## [0.2.1] - 2026-03-30

### 🐛 Bug Fixes

- Remove failing, unnecessary config load from e2e full sim
- Set flags on init
- Correct teams displayed in printable

## [0.2.0] - 2025-07-15

### 🚀 Features

- Add button to copy HTML results to clipboard
- Copy html to clipboard from results
- Add ui feedback on results when no league config loaded

### 🐛 Bug Fixes

- Remove ts-expect-error and fix minileagues type
- Save league data to local storage
- Enable scrolling in tracker

### 🎨 Styling

- Add subtle background because prettier :)
- Clearer config loading buttons
- Gap between no league data alert and results
- Capitalise when no rounds exist

### ⚙️ Miscellaneous Tasks

- Update todos
- Consolidate utils, add results combiner and htmler
- Add release github action
- Add git cliff config and release script
- Correct release script and github action

<!-- generated by git-cliff -->
