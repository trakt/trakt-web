# Performance Guidelines

Distilled from the `perf/curated` sweep. Read when the work touches
animations, scroll handlers, IntersectionObservers, rxjs query plumbing,
critical-render path, or any change whose stated goal is "make this faster".

---

## Animations & transitions

### Prefer compositor properties

Animate **`transform`** and **`opacity`** only. Avoid the
layout-triggering properties: `width`, `height`, `top`, `left`, `right`,
`bottom`, `margin`, `padding`, `backdrop-filter`.

```scss
/* Bad - reflows every frame */
.tab-indicator {
  left: calc(var(--active-index) * (var(--tab-width) + var(--tab-list-gap)));
  transition: left var(--transition-increment) ease-in-out;
}

/* Good - composited */
.tab-indicator {
  left: 0;
  transform: translateX(
    calc(var(--active-index) * (var(--tab-width) + var(--tab-list-gap)))
  );
  transition: transform var(--transition-increment) ease-in-out;
  will-change: transform;
}
```

Same pattern applies to:

- Tab indicators (`translateX`, not `left`)
- Slide-in/out transitions (`translate`, not `width`/`height`)
- Cover image swap (`opacity`/`transform`, not `width`/`left`)
- Modal overlays (fade `opacity`, not animate `backdrop-filter`)

### Progress-bar trap

`transform: scaleX(ratio)` on a full-width fill **squishes its
border-radius on the right edge** (scaled corners pinch). Two paths:

1. Keep `width: var(--progress)%` - layout cost on a small bar is
   negligible.
2. Use `clip-path: inset(0 calc((1 - var(--ratio)) * 100%) 0 0 round X)` -
   composited and preserves rounded corners.

Don't ship a scaleX progress bar without confirming the rounded-edge case.

### Image fade-in

`CrossOriginImage` already animates `opacity` via the `image-loaded` class
on `onload`. **Do not add artificial setTimeout delays** before flipping
the class - the natural decode delay is the fade. Add `decoding="async"`
on the `<img>` so the decode happens off the main thread.

---

## Scroll listeners

### Always passive, always rAF-coalesced

Unless the handler calls `preventDefault()`, attach with
`{ passive: true }` so the compositor keeps scrolling smooth while JS
runs. Coalesce frequent emissions with `requestAnimationFrame` so the
handler runs at most once per frame.

```ts
let frame = 0;
const schedule = () => {
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    handler();
  });
};

node.addEventListener('scroll', schedule, { passive: true });

return {
  destroy() {
    if (frame) cancelAnimationFrame(frame);
    node.removeEventListener('scroll', schedule);
  },
};
```

### Spec consequence

When tests dispatch synthetic `scroll` events against a rAF-coalesced
handler, **flush a frame** before asserting:

```ts
const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

node.dispatchEvent(new Event('scroll'));
await nextFrame();
expect(node.classList).toContain('scrolled-down');
```

---

## IntersectionObserver

### Pool by options

Don't construct a fresh `IntersectionObserver` per node. Pool by
serialized options so all callers with the same threshold/root share one
observer.

```ts
const pools = new Map<string, Pool>();
function getPool(options: IntersectionObserverInit): Pool {
  const key = JSON.stringify(options);
  return pools.get(key) ?? /* create + cache */ ...;
}
```

The shared `whenInViewport` action in `$lib/utils/actions/whenInViewport`
already implements this. Use it.

### Test mock must match real semantics

The pool looks callbacks up by `entry.target`. Make sure
`test/mocks/IntersectionObserver.mock.ts` fires its synthetic entry with
the actual element passed to `observe()` (not a freshly-created `<div>`).
Otherwise pool-based lookups silently swallow every hit in tests.

---

## rxjs plumbing

### `combineLatest` re-emits fresh identity

`combineLatest(...).pipe(map(spread))` emits a new object every upstream
tick, even when values are identical. Multi-subscriber chains should:

1. Multicast with `shareReplay({ bufferSize: 1, refCount: true })` so
   downstream consumers reuse one chain.
2. Add `distinctUntilChanged(shallowEqual)` so identical-by-value
   emissions short-circuit before the cascade.

Use `isShallowEqual` from `$lib/utils/object/isShallowEqual.ts`. Don't
re-implement.

### Survive transient detach with `share` + delayed reset

`shareReplay({ refCount: true })` tears down the source observable when
the last subscriber leaves - costly on navigation (list -> detail ->
list) because the chain restarts from scratch.

`shareReplay({ refCount: false })` keeps the chain alive forever -
**permanent subscription, memory leak** when the source is a TanStack
QueryObserver or any long-lived listener.

The right pattern is `share` with a delayed reset:

```ts
import { ReplaySubject, share, timer } from 'rxjs';
import { time } from '$lib/utils/timing/time.ts';

source$.pipe(
  share({
    connector: () => new ReplaySubject(1),
    resetOnRefCountZero: () => timer(time.seconds(1)),
  }),
);
```

The 1s grace period covers transient detach (nav round-trip) while still
tearing down for real unmounts.

### Don't recreate Subjects when `map` will do

```ts
// Bad - new BehaviorSubject every upstream emission
country$ = user$.pipe(
  switchMap((u) => new BehaviorSubject(toCountry(u))),
);

// Good - just map
country$ = user$.pipe(map(toCountry));
```

### Dedupe URL/param chains by serialized form

`URLSearchParams` instances are not value-equal even when serialized
strings match. Add `distinctUntilChanged((a, b) => a.toString() === b.toString())`
on `search$`-style chains so identical query strings short-circuit
downstream refetches and re-renders.

### Coalesce localStorage writes

Frequent settings toggles synchronously hit localStorage and block the
main thread. Use a debounced Subject grouped by key:

```ts
writes$
  .pipe(
    groupBy((w) => w.key),
    mergeMap((group) => group.pipe(debounceTime(200))),
  )
  .subscribe(({ key, value }) => safeLocalStorage.setItem(key, value));
```

`persistDebounced` in `$lib/utils/storage/persistDebounced.ts` already
does this.

---

## Bundle & critical-render path

### Sample at the loader, not just the SDK

SDK-level sample rates (`replaysSessionSampleRate: 0.1`) still **download
and initialize the integration for 100% of users**; only recording is
skipped. To save the chunk for the unsampled cohort, gate the dynamic
import itself:

```ts
const REPLAY_LOAD_SAMPLE = 0.1;
const shouldLoadReplay = Math.random() < REPLAY_LOAD_SAMPLE;

if (shouldLoadReplay) {
  import('@sentry/sveltekit').then(({ replayIntegration }) => {
    Sentry.addIntegration(replayIntegration(...));
  });
}
```

Tradeoff: on-error replays drop to the sample rate too. Set internal
rates to `1.0` so the sampled cohort still gets full coverage.

### Defer third-party scripts off critical render

CSS: load asynchronously by setting `media="print"` then swapping to
`"all"` on load. **Svelte 5 requires an expression handler** - the
HTML-string `onload="this.media='all'"` does not compile:

```svelte
<link
  rel="stylesheet"
  href="https://cdn.plyr.io/3.8.3/plyr.css"
  media="print"
  onload={(e) => ((e.currentTarget as HTMLLinkElement).media = "all")}
/>
```

JS: add `defer` attribute. The script executes after parsing without
blocking.

### Image rendering hints

On every `<img>`:

- `loading="lazy"` (unless above the fold)
- `decoding="async"` (always)

For responsive `srcset`, the underlying schema must expose multiple
variants. `ImageUrlsSchema` currently only exposes `medium` and `thumb`;
extending it (or per-domain schemas like YIR fanart) is a prerequisite
before adding `srcset` to those call sites.

---

## Viewport-gating: prefetch usually wins

Don't viewport-gate a list's data fetch just because it's below the fold.
Browsers handle a handful of parallel queries fine, and a small upfront
spend primes the cache so the list renders instantly when the user
scrolls. Reserve viewport-gating for cases where the fetch is heavy
enough to demonstrably hurt initial paint of the visible content.

DOM render-gating is a different layer - SectionList already
viewport-gates its own children's *rendering*. The fetch lives one layer
up (in the `*List` wrapper that calls `useQuery`), so gating only the
SectionList doesn't reduce network cost.

---

## Provider mount deferral

Don't defer mounting providers (drawer, dialog, etc.) behind
`requestIdleCallback` or `onMount(setTimeout(...))` for "boot speed". The
mount cost is negligible compared to the race risk: early user
interactions (e.g. clicking a button within the first 500ms) hit a
not-yet-mounted provider and silently no-op.

---

## Empty methods

Use `NOOP_FN` from `$lib/utils/constants.ts`, not inline `() => {}`.
DeepSource flags inline empties as `JS-0321`.

```ts
import { NOOP_FN } from '$lib/utils/constants.ts';

if (!element) {
  return { destroy: NOOP_FN };
}
```

---

## Sanity checks before claiming a perf win

- **Is the work the change skips actually expensive?** A `combineLatest`
  chain that emits 20 times per session does not justify a `shareReplay`
  in isolation. The chain has to either be hot or feed expensive
  downstream work.
- **Does an SDK / library already self-gate?** Check before wrapping.
  `QueryDevtools` already gates on `dev` internally; wrapping it in
  `{#if dev}` is dead weight.
- **Does the perf optimization fight UX?** Lazy-mount of below-fold
  fetches stops prefetch and forces a spinner on scroll. Mount-defer
  drops early clicks. ScaleX on progress bars breaks border-radius.
  Honest tradeoff comes first.

---

## Commit scopes

`commitlint.config.js` enforces `scope-enum` strictly. Before committing
perf work, pick a scope from the enum. Common mismatches:

| Tempting scope | Use instead |
|----------------|-------------|
| `scroll`       | `list` (or matching feature) |
| `pagination`   | `list`                       |
| `modal`        | `dialog`                     |
| `tabs`         | `transition`                 |
| `sentry`       | `errors`                     |
| `storage`      | `settings`                   |
| `viewport`     | `card`                       |
| `parameters`   | `parameter`                  |
| `timing`       | `transition`                 |
| `image`        | `transition` or `cover`      |
