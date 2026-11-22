# Trader Edge Tracker
https://smackey321.github.io/trader-edge-tracker/

An offline-capable trading journal in a single HTML file. Open the source file
without Supabase configuration to keep data in your browser, or build and deploy
the app to Vercel with Supabase configuration for email/password accounts and cloud sync.

Built for futures traders in particular, but it handles stocks, options, forex
and crypto too.

---

## Install

1. Download `trader-edge-tracker.html`.
2. Save it somewhere permanent — `Documents\Trading\` is fine. Not your Downloads
   folder, which people tend to clear out.
3. Double-click it. It opens in your default browser and stores data locally.

**To get a Start-menu icon (Windows, Edge):** open the file, then
**Settings menu (⋯) → Apps → Install this site as an app**.

**Chrome:** **⋮ → Cast, save and share → Install page as app**.

There is no update mechanism. To upgrade, back up your data first (below),
download the new file, and restore.

---

## What it does

**Trade log.** Every trade is a list of executions, so scaling in and out is
first-class. It computes weighted average entry and exit, realized P&L on the
closed portion, and tracks anything still open. Fees are per fill.

**Futures support.** Built-in contract specs for roughly 35 contracts (ES/MES,
NQ/MNQ, YM/MYM, RTY/M2K, CL/MCL, GC/MGC, SI, HG, NG, the ZB/ZN/ZF/ZT complex,
grains, currency futures, MBT). Type `ESZ5`, `/MNQ`, `MNQM26` or `NQ1!` and tick
size and point value fill themselves in. P&L is reported in both ticks and
dollars. Anything not in the table defaults to 1 point = 1 unit and can be
overridden per trade.

**Multiple accounts.** Each with its own starting balance, currency, commission
rate and notes, plus an "All accounts" combined view. Optional profit target,
max drawdown (trailing or static) and daily loss limit render as live progress
bars — built for prop-firm evaluations.

**Statistics.** Win rate, profit factor, expectancy, average R, payoff ratio,
max drawdown, streaks, green vs red days, net ticks, average hold time, fees as
a share of gross. Breakdowns by setup, symbol, weekday, hour of entry, mistake
tag, and scaled vs single-shot.

**Calendar.** Month grid with daily P&L and a week-total column.

**Replay.** Two modes. *Trade* replays candle by candle with your fills, stop and
target appearing at the right bar, showing live position, average entry, and
open and realized P&L. *Session* replays a whole day's trades against a building
P&L curve and needs no price data at all.

**Journal.** Dated session notes, linked to the calendar.

**Import.** A four-step wizard for broker CSVs, handling both round-trip trade
reports and raw fill logs. Fills are stitched into trades chronologically,
including scale-ins, scale-outs and reversals.

---

## Importing broker CSVs

**Settings → Import broker CSV**, or the button on the Trades tab.

The wizard reads your file, asks whether each row is one fill or one completed
trade, guesses which column is which, and shows you a preview with the computed
P&L before anything is saved. Correct any bad guesses at the mapping step.

Any CSV with a date, symbol, side, quantity and price will work. Exports from
Tradovate, NinjaTrader, TradeStation, Interactive Brokers, Thinkorswim, Webull,
TastyTrade and TradeZella have all been used as reference formats.

If your dates are DD/MM/YYYY, set that explicitly at step 2 rather than relying
on detection. Ambiguous dates like `03/04/2026` cannot be resolved automatically.

**Always check the preview totals against your broker statement before
importing.** Fee columns and side labels vary wildly between platforms.

---

## Price bars for candle replay

The app cannot download market data, because it has no network access at all.
Candle replay only works with bars you provide.

**Settings → Import price bars**, or drag a CSV straight onto the replay chart.

Expected columns: a date/time stamp plus open, high, low and close. Volume is
optional but renders a volume pane if present. One file can hold several
symbols if you map a symbol column. Repeat imports merge with what's already
stored rather than replacing it.

1-minute bars are the sweet spot. A full futures session is roughly 1,400 rows.

Where to export from:

| Platform | Path |
|---|---|
| TradingView | Right-click chart → Export chart data |
| NinjaTrader | Tools → Historical Data → Export |
| Sierra Chart | File → Export Intraday Data to Text File |
| TradeStation | Data window → right-click → Export |
| Tradovate / IBKR | Reports section, CSV export |

Symbols resolve by root, so bars saved as `ES` will be found by trades logged as
`ESZ5`, `/ES` or `ESH6`.

---

## Your data

The standalone source file uses this browser's local storage and does not
connect to a server. Clearing browser data or switching browsers can make that
local journal unavailable.

The Vercel build starts with a private temporary Supabase session. To sync your
journal between devices, open **Settings → Account access** and create an account
with your email and password, or sign in to an existing account. Accounts,
trades, journal notes, screenshots, and imported bar sets are stored in a row
protected by row-level security. Your password is handled by Supabase Auth and
is never stored in the journal.

Before switching from the standalone/local version to Vercel, export a JSON
backup from the version that currently holds your trades. Browser storage from
`file://` or another site is not automatically visible to the Vercel domain;
use **Settings → Restore backup** to import that file. When you create an
account or sign in from a browser with a temporary journal, the app offers to
copy that journal to your account if it differs from the cloud copy. The cloud
copy is backed up before it is replaced.
If email confirmation is enabled, verify your address and return to the same
browser to finish moving its temporary journal into your account.

Temporary journals are tied to the browser session. Create or sign in to an
email account to access your data from other devices. Keep a backup before
clearing browser data or switching devices.

**Back up regularly.** Settings → *Back up to file* writes a JSON file
containing everything: accounts, trades, notes and bar data. *Restore backup*
reads it back. There is also a CSV export for spreadsheets and tax prep.

Treat the JSON backup as an independent recovery copy.

---

## Deploy to Vercel with Supabase

1. Create a Supabase project.
2. In Supabase Authentication settings, enable the **Email** provider and
   **Anonymous Sign-Ins**.
3. Configure the Supabase **Site URL** and allowed redirect URLs for your Vercel
   production and preview domains so email verification and password reset
   links return to the app.
4. Run [supabase.sql](./supabase.sql) in the Supabase SQL editor. It creates the
   `trader_edge_journals` table and owner-only row-level security policies.
5. Import this repository into Vercel. The included `vercel.json` runs the build
   and serves the generated `dist` directory.
6. Add these Vercel environment variables for every environment you deploy:

   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

   Use the project URL and public anon key from Supabase **Project Settings →
   API**, then redeploy. These client values are embedded in the browser app.
   **Never put the Supabase service-role key in this app or in a client-side
   environment variable.** Security comes from Supabase Auth and the deployed
   row-level security policies.

The app only connects to Supabase when built with the variables above. Its source
HTML remains local-only. Price bars still need to be imported from CSV; the app
does not download market data.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `N` | Log a new trade |
| `1`–`6` | Switch tabs |
| `Esc` | Close any panel |
| `Space` | Play / pause in Replay |
| `←` `→` | Step one bar in Replay |

---

## Disclaimers

**Not financial advice.** This is a record-keeping tool. It does not generate
trade recommendations, signals, or forecasts, and nothing it displays should be
treated as advice to buy or sell anything.

**Not an accounting record.** P&L figures are computed from what you enter and
from a built-in contract spec table that may be incomplete or out of date.
Exchanges change contract specifications. Reconcile against your broker
statements, and use your broker's official records for taxes, not this.

**No warranty.** The software is provided as-is under the MIT License. Trading
futures and other leveraged instruments involves substantial risk of loss.

**Past performance shown in this journal does not predict future results.**

---

## Contributing

The app UI is still a single HTML file. The Vercel build uses Node's built-in
modules only and loads the Supabase SDK from jsDelivr at runtime. Keep
changes small and focused, and describe what you changed and why.

No dependencies will be added. If a feature needs a library, it doesn't belong
in this project.

---

## License

MIT. See [LICENSE](LICENSE).

Substantially authored with the assistance of an AI model. Note that the
copyright status of AI-generated code is unsettled in the United States, where
the Copyright Office requires human authorship for protection.
