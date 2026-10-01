# Historical Explorer and Synthetic Lab

Updated: October 1, 2026. Implemented educational scope; no next-draw forecasts.

## Historical data

The bundled snapshot contains 119 base-game results collected from the first visible public archive page per game: 30 Powerball, 60 Mega Millions and 29 Cash 5. Source pages:

- https://nclottery.com/powerball-past-draws
- https://nclottery.com/mega-millions-past-draws
- https://nclottery.com/cash5-past-draws

Collected October 1, 2026 through normal public browser access. Direct research-tool requests returned 403; no challenge bypass, login or private endpoint was used. Dates and individual numbers were extracted from rendered table cells. Undated Double Play rows were excluded. The snapshot is partial and static, not the entire archive or a live results feed. Powerball ends September 28; Mega Millions September 29; Cash 5 September 30. Archived pages may lag; the site does not claim the latest completed drawing is included.

The explorer shows occurrence counts in numerical order, separate bonus counts, odd-count distribution, average main-number sum, dates and recorded rows. Uniform-reference counts describe expected sample counts under independence. They are not next-draw probabilities or a significance test. Samples differ in date range and size; compare using filters rather than assuming equal windows.

Normalized JSON imports replace current history only after complete validation. Reject duplicates, invalid dates, dates on/after today in Eastern time, repeated main values, wrong ranges and unsupported games. Limit imports to April 8, 2025 onward for consistent current matrices; older-format histories require a future version-aware importer. Imported sources are labelled unverified. Imports stay browser-local; bundled snapshot can be restored. A broader downloadable CSV adapter/live refresh is not implemented.

## Synthetic experiment

A fictional uniform independent 5-of-20 model is deliberately separate from real games. Generate 400 training draws, freeze frequent/infrequent selections, then evaluate against 2,000 held-out draws. Random baseline uses a separate seeded random stream; all methods see identical test outcomes. Frequency ties resolve by numeric order. No real history enters the simulation, no future test outcome enters training, and candidate selections are not displayed as real ticket suggestions.

Each method reports exact match-count histogram, mean matches and approximate normal 95% interval for the simulated mean. The theoretical mean is 5×5/20=1.25 for every fixed or independent random selection. Interval overlap is not a formal difference test, and one run cannot establish superiority. Seeds make experiments reproducible; changing seeds tests chance variation. Trials are bounded to prevent excessive computation. Pseudo-random simulation is for education, not cryptographic use.

## Validation

19 automated tests currently pass: 11 retained legacy-record tests and 8 research tests. Research tests cover history validation, independent bonus pools, descriptive reconciliation, real snapshot counts and spot checks, valid synthetic sampling, reproducibility, bounded settings and empty filters. Syntax/build checks pass. Browser checks and cloud status are appended to the delivery report after verification.

## Deployment and privacy

GitHub Pages publishes only app assets and normalized public numerical history. Raw extracts, prior personal planning documents and diary records are excluded from the deployed artifact. Browser imports are not uploaded to a backend. The old diary storage key remains untouched and exportable. No lottery account or purchase actions are present.
