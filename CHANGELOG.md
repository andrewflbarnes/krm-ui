# Changelog

All notable changes to this project will be documented in this file.

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
