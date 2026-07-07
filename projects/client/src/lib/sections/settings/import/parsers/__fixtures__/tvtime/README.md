# TV Time real-export fixtures

Anonymized captures of **real** TV Time exports from user-submitted
import-failure reports (`trakt/import-reports`). They exist because hand-written
mocks missed real-world column-shape drift: the original v2 bug (reading
`episode_id` when the export uses `ep_id`) passed its unit tests because the
mock fabricated a column the real export never had. These fixtures pin the
parser against what TV Time actually emits.

Consumed by `../../TvTimeRealExports.spec.ts`.

## Files (one per real export shape)

| Fixture                                                                  | Shape                                                                  | Source parser        |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------- | -------------------- |
| `gdpr-v2-tracking-prod-records-v2.csv`                                   | GDPR v2 tracking (episodes via `ep_id`, watchlist via `user-series-*`) | `TvTimeGdprParser`   |
| `tvtime-series-episodes.csv` / `tvtime-movies.csv` / `tvtime-series.csv` | current "export my data" CSV                                           | `TvTimeExportParser` |
| `tvtime-series.json` / `tvtime-movies.json`                              | current "export my data" JSON                                          | `TvTimeExportParser` |

## Anonymization

Scrubbed: `user_id` → `0`, `uuid`/`series_uuid` → synthetic sequential, `gsi` /
`most_recent_ep_watched` / `followed_at` → blank (they embed per-user timestamp
maps). **Kept** (public catalog data, required by the parser): TVDB/IMDb ids,
titles, season/episode numbers, `is_watched`, series `status`, `watched_at`.
Rows are sampled down to cover every parser branch.

Regenerate with the anonymizer used to create them:
`.agents/scripts/anonymize-tvtime-export.py <mode> <real-file> <out>` (see the
`triage-import-reports` skill). Never commit a raw export - always run it
through the anonymizer first, and grep the result for user ids before adding.
