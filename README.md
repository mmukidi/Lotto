# Little Luck — Spending Diary MVP

A static web app for recording already-purchased tickets, monthly spending, collected prizes and exact draw dates copied from receipts. No lottery recommendations, account connection, cart preparation or purchases.

## Run

Run `npm start`, then open http://127.0.0.1:4173. Run `npm test` for accounting and validation tests. Run `npm run build` to create the four public assets in `dist/`. No package installation is required; use Node 24 for the tested runtime.

## Hosting

In repository Settings → Pages, select GitHub Actions as the publishing source. The workflow tests and builds before deploying only `dist/`. The expected URL after successful deployment is https://mmukidi.github.io/Lotto/. Pull requests run tests/build without deployment.

Records remain in each browser on each device and do not sync. Export backups regularly. Never commit receipt exports, credentials or personal records. Cloud hosting provides the interface, not scheduled jobs or shared storage.

## Validation

Eleven unit tests passed locally, plus browser checks for ticket saving, persistence after reload, duplicate rejection, prize updates and removal. Full browser download/restore and phone layout checks remain pending. No live lottery transaction was performed.
