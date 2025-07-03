# TODO: Features

## Completed

- [x] Preset for all 4 leagues, 3 divisions
- [x] League switcher
- [x] League results by division and by team
- [x] Pull data from Google Sheets
- [x] localStorage for persistence
- [x] Team selection and seeding
- [x] Race list 1
- [x] Race sheet 1
- [x] Mini leagues show wins
- [x] Mini leagues show positions
- [x] DSQ tracking
- [x] Export data
- [x] Automatic DSQ resolution
- [x] Race sheet 2
- [x] Race list 2
- [x] Knockouts
- [x] Results
- [x] Light and dark mode
- [x] Print race list ("light" mode equivalent, alternatively screenshot)
- [x] Print race sheet ("light" mode equivalent, alternatively screenshot)
- [x] Print knockout ("light" mode equivalent, alternatively screenshot)
- [x] Manual pre-start team shuffling
- [x] Race bys (team unavailable)
- [x] Visualise configuration presets for mini leagues
- [x] Visualise configuration presets for rounds
- [x] Don't show race stages which have no config
- [x] Reopen stages
- [x] Custom URLs for pulling config
- [x] Add all configs up to 32 teams (:
- [x] Set round metadata on creation (description, venue, round number, etc.)
- [x] Split mini5 races to prevent congestion: `[[2, 2], [1, 2], [1, 2]]`
- [x] Fix seeding for teams > 10 - use numerical not lexical
- [x] Don't allow reopen on non owned races
- [x] Support 1 team
- [x] Support 0 teams
- [x] Don't require config to be loaded to start a race

## Must

- [ ] Modify configuration presets for mini leagues
- [ ] Modify configuration presets for rounds
- [ ] Custom configuration groups
- [ ] Draw Resolution (by selection/low seed/high seed/other?)
- [ ] Race skips (teams unavailable)
- [ ] Optional races (high team numbers)
- [ ] Knockout draws (teams unavailable/race unrun)
- [ ] Ability to run individual board races
- [ ] Support abandoning races
- [ ] Support modifying league data

## Should

- [ ] Don't show empty mini leagues or divisions (0/1 team) as appropriate
- [ ] Split 30 races (all mini5) into 5 segments
- [ ] More general solution for configuring 10 races/5 team league race splits
- [ ] Dynamic test/validation for custom round config
- [ ] DSQ reasons
- [ ] Support optional knockouts
- [ ] Generate results HTML
- [ ] Support custom splits (instead of an alogrithmic split 3 ways)
- [ ] Track seeding by year from tracker/scraping
- [ ] Add validity checks to ManageConfigRound
- [ ] Reduce number of clicks to load config from /manage/new
- [ ] Import data from file
- [ ] Import data via link (base64)

## Could

- [ ] Use theme colors for minileague highlighting
- [ ] Preserve valid future stage results when progressing following a re-open
- [ ] Push results to Google Sheets
- [ ] Push results to website
- [ ] Consolidate the confirm/discard modals in ConfigClub
