# Little Luck — Historical Explorer and Synthetic Lab

Live website: https://mmukidi.github.io/Lotto/

Explore a dated public numerical snapshot from the NC Lottery archives for Powerball, Mega Millions and Cash 5. View date-filtered occurrence counts, bonus counts, odd-count distributions and recorded rows. Import/export normalized JSON histories in your browser.

The bundled snapshot has 119 base draws (30 Powerball, 60 Mega Millions, 29 Cash 5), captured October 1, 2026. It is partial, static and not a live feed. Source links and date coverage are displayed. Imports are labelled user-provided, validated and restricted to recent compatible game formats.

The separate synthetic lab uses a fictional independent 5-of-20 model. It compares random, training-frequency and training-infrequency methods on the same 2,000 held-out draws after 400 training draws. A seed makes runs reproducible. Histograms, mean matches and approximate mean intervals are shown. No real history is used to generate candidates or forecasts.

## Run and validate

Use Node 24. No packages need installing.

- `npm start`: local preview at http://127.0.0.1:4173.
- `npm test`: 19 tests, including 8 research tests and 11 retained legacy-record tests.
- `npm run build`: publishable assets in dist/.

GitHub Actions tests/builds before deploying only dist/ to Pages. Relative URLs support the repository subpath. No lottery login, cart preparation, payment, scheduled jobs or next-draw predictions are included.

Imported data and old diary records stay browser-local, separate from the repository. Budget tracking has been removed. Existing diary records remain exportable. Never commit personal records or credentials.

For data provenance, methods and limitations, see docs/RESEARCH_EXPLORER.md. Full-history CSV adapters and live refresh are not implemented.
