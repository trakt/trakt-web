---
trigger: glob
globs: 'projects/client/src/lib/features/analytics/**'
description: 'Usage tracking via HAL: adding events, typing payloads, allowlist constraints.'
applyTo: 'projects/client/src/lib/features/analytics/**'
---

# Analytics Guidelines

Usage analytics go to HAL through `lib/features/analytics`. Events are batched
and sent by `_internal/createHalEngine.ts`.

## Adding an event

1. Add the key to `events/AnalyticsEvent.ts`. Use
   `buildEventKey(PREFIX, 'action')` with an existing prefix, or add a prefix
   for a new feature (e.g. `MIXTAPE_PREFIX`).
2. Type its payload in `events/AnalyticsEventDataMap.ts`. Use `never` for events
   with no payload.
3. Fire it with `useTrack(AnalyticsEvent.X)` in the hook or component that owns
   the interaction. Example: `sections/lists/user/_internal/useDeleteList.ts`.
4. If the payload needs shaping, put that in a pure `to*Tracking` mapper with a
   spec. Example: `sections/vip/_internal/cancel/utils/toVipCancelTracking.ts`.

## HAL allowlist (blocking)

- HAL rejects a whole batch if any event name in it isn't on its server-side
  allowlist. `isKnownAnalyticsEvent` only checks names against the local
  `AnalyticsEvent` list, so it can't catch this. **Get the name added to HAL
  before the event ships**, or each batch containing it loses up to 49
  neighbouring events.
- Numeric fields only become queryable numbers if they're in `METRIC_KEYS`
  (`_internal/splitEventPayload.ts`) **and** in HAL's allowlist. Any other field
  is stored as a string.
- Batches are capped at 50 events. Never fire per frame, per scroll or per
  keystroke.

## Payload rules

- **No personal data.** No usernames, emails, free text, or resolved paths that
  contain user slugs. Page views send the route template (`/movies/[slug]`).
- Prefer small closed unions (`'add' | 'remove'`) over open strings, so
  dashboards group cleanly.
- Bucket raw values that could identify someone (e.g. tenure ranges, not exact
  months).
