# Performance Guidelines

Framework-agnostic perf principles for client-side work. Read when the work
touches animations, scroll/resize handlers, observers, reactive streams, async
data, bundle/critical render path, images, or tests that interact with any of
the above. Sources are linked inline so the reader can verify the rule against
current authoritative docs rather than trust folklore.

---

## Animation & compositing

- **Animate only `transform` and `opacity`.** Other properties (`top`, `left`,
  `width`, `height`, `margin`, `backdrop-filter`) trigger layout or paint every
  frame; `transform` and `opacity` run on the compositor.
  [web.dev: Animations guide](https://web.dev/articles/animations-guide).
- **Use translate/scale/rotate, not their geometric equivalents.** `translate()`
  replaces top/left; `scale()` replaces width/height; `rotate()` replaces
  angular layout changes.
  [web.dev: Compositor-only properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count).
- **Don't preemptively promote elements to their own layer** with `will-change`
  or `translateZ(0)` on the off-chance they animate. Each promoted layer costs
  GPU memory and management overhead; over-promotion is a measurable regression.
  [web.dev: Compositor-only properties](https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count).
- **Treat `will-change` as a last-resort diagnostic.** Apply it surgically via
  JS just before a change and reset to `auto` when the animation ends; never
  blanket-declare it in stylesheets.
  [MDN: `will-change`](https://developer.mozilla.org/en-US/docs/Web/CSS/will-change).
- **Scaling rounded shapes via `transform: scale(...)` re-rasters in Chromium
  (since Chrome 53) unless `will-change: transform` is set on the element.** CSS
  animations and the Web Animations API are exempt; imperative script-driven
  scale is not. With `will-change: transform` the element is locked to a fixed
  bitmap and scaled cheaply, at the cost of crispness during the scale.
  [Chrome Blog: Re-rastering on composite](https://developer.chrome.com/blog/re-rastering-composite).
- **For progress / fill bars, prefer `width` or `clip-path: inset(...)` over
  `scaleX`.** ScaleX uniformly stretches the element's `border-radius`, so the
  right edge of a 30%-filled bar gets a pinched, scaled corner. `width` keeps
  corners shaped; `clip-path: inset(0 X 0 0
  round Y)` is composited and keeps
  corners crisp.
  [MDN: `clip-path`](https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path).

---

## Event listeners

- **Declare touch and wheel listeners `{ passive: true }`** unless the handler
  calls `preventDefault()`. Without `passive`, the browser must wait for JS to
  finish before scrolling because it cannot statically predict
  `preventDefault()`. Chrome data: 80% of touch handlers that blocked scrolling
  never called `preventDefault()`; 10% added more than 100 ms of delay.
  [Chrome / Lighthouse: passive listeners](https://developer.chrome.com/docs/lighthouse/best-practices/uses-passive-event-listeners),
  [MDN: `addEventListener` passive](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener).
- **Coalesce high-frequency handlers (scroll, resize, animation-frame updates)
  with `requestAnimationFrame`.** Schedule at most one rAF per frame; cancel
  pending frames on teardown. Run only paint-affecting work in the rAF callback.
  [MDN: `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
- **Don't rAF-throttle `pointermove`** to reduce event rate; user agents already
  coalesce pointermove updates into single events. Use
  `PointerEvent.getCoalescedEvents()` only when sub-frame fidelity matters
  (drawing tools, fine-grained gesture trails).
  [MDN: `PointerEvent.getCoalescedEvents()`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/getCoalescedEvents).
- **Always remove listeners (and cancel pending rAFs) on teardown.** Lingering
  listeners hold their closures and the elements they captured in memory.
  [MDN: `removeEventListener`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener).

---

## IntersectionObserver, ResizeObserver, lazy work

- **One observer can watch many targets, so share rather than multiply.**
  Construct a single `IntersectionObserver` per `(root, threshold)` config and
  call `observe()` for every target that needs that config.
  [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API),
  [W3C: Intersection Observer](https://www.w3.org/TR/intersection-observer/).
- **Keep threshold lists small.** Each threshold can fire the callback once per
  target per crossing, so `[0, 0.25, 0.5, 0.75, 1.0]` is 5x the work of `[0]`
  for the same observation.
  [MDN: Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API).
- **Reach for `content-visibility: auto` before reaching for a custom
  observer.** It lets the browser skip layout, paint, and hit-testing for
  off-screen subtrees while keeping find-in-page, tab order, and focus working.
  Pair it with a `contain-intrinsic-size` hint so off-screen content does not
  collapse and cause layout shift.
  [web.dev: `content-visibility`](https://web.dev/articles/content-visibility),
  [MDN: `content-visibility`](https://developer.mozilla.org/en-US/docs/Web/CSS/content-visibility).
- **Prefer native `loading="lazy"` over a custom IntersectionObserver for image
  deferral.** It is connection-aware (1250 px below the viewport on 4G, 2500 px
  on slower) and free of JS cost.
  [web.dev: Browser-level lazy loading](https://web.dev/articles/browser-level-image-lazy-loading).
- **Never lazy-load above-the-fold or LCP-relevant images.** Lazy loading them
  adds an unnecessary network round-trip into the LCP critical path. Always set
  explicit `width`/`height`; without them the browser may treat the image as 0x0
  and eagerly load everything to be safe.
  [web.dev: Browser-level lazy loading](https://web.dev/articles/browser-level-image-lazy-loading).

---

## Reactive streams (RxJS)

- **Multicast cold sources that have more than one subscriber.** Without a
  multicast operator (`share`, `shareReplay`), each subscription re-runs the
  entire pipeline, including any side-effecting source (HTTP, observer setup).
  [rxjs.dev: `share`](https://rxjs.dev/api/operators/share).
- **Pick the multicast variant that matches your replay needs.** Use
  `shareReplay({ bufferSize: 1, refCount: true })` for "BehaviorSubject
  semantics with auto-teardown when nothing is listening." Use
  `share({ connector: () => new ReplaySubject(1), resetOnRefCountZero: () => timer(N) })`
  when the source must survive a brief unsubscribe (a navigation round-trip,
  say) but still tear down when truly idle.
  [rxjs.dev: `shareReplay`](https://rxjs.dev/api/operators/shareReplay),
  [rxjs.dev: `share`](https://rxjs.dev/api/operators/share).
- **Avoid `shareReplay({ refCount: false })` (and the equivalent
  `share({ resetOnRefCountZero: false })`) on long-lived sources.** The
  underlying subscription is never torn down; that is fine for true app-scope
  singletons, a memory leak for query observers or DOM listeners.
  [RxJS issue 5034 / discussion 6731](https://github.com/ReactiveX/rxjs/issues/5034).
- **Use `distinctUntilChanged` whenever the upstream may emit new _identities_
  with identical _values_.** A `combineLatest(...).pipe(map(spread))` builds a
  fresh object each tick; provide a key/equality function (value-based for
  primitives, structural for objects) so downstream consumers do not re-render
  on no-op upstream churn.
  [rxjs.dev: `distinctUntilChanged`](https://rxjs.dev/api/operators/distinctUntilChanged).
- **Map, don't reconstruct.** If a derived stream is a pure function of an
  upstream, use `map` or `combineLatest` + `map`; don't tear down and recreate a
  Subject on every change. Recreated subjects break identity for downstream
  consumers and replay nothing on resubscribe.
  [rxjs.dev: `BehaviorSubject`](https://rxjs.dev/api/index/class/BehaviorSubject).
- **Group-debounce writes to side-effect sinks.** For coalescing bursty events
  that target many keys (localStorage writes, telemetry pings), partition the
  stream via `groupBy(keyFn)` and then
  `mergeMap(group => group.pipe(debounceTime(N)))`. Per-key debounce, single
  subscription. [rxjs.dev: `groupBy`](https://rxjs.dev/api/operators/groupBy).

---

## Driving hooks from Svelte runes

The `use*` hooks return RxJS Observables backed by `useQuery` (and ultimately a
`@tanstack/query-core` QueryObserver). The wrong consumer pattern silently
re-creates the entire observer chain on every reactive flush.

- **Never wrap a `use*` hook that drives `useQuery` in `$derived`.** The pattern
  `const { show } = $derived(useShow(params.slug))` looks innocuous but
  re-instantiates `useShow` (and every internal `useQuery(...)` inside it) on
  each reactive tick. Each fresh `useQuery` call spawns a fresh QueryObserver
  via the bridge; the previous one tears down. On a summary page this multiplied
  observers 6-11x per query per page visit before we fixed it.
- **Hooks that drive queries take `Observable<T>`, not a bare value.** When
  authoring a new `use*` hook that calls `useQuery`, accept the reactive input
  as `Observable<T>`. Pipe it into the query options:
  `useQuery(input$.pipe(map((v) => somethingQuery(v))))`. This routes through
  `reactiveQueryBridge`, which calls `observer.setOptions(...)` on subsequent
  values instead of constructing a new observer.
- **Bridge route params into Observables with `fromRune`.** Use the helper at
  `$lib/utils/store/fromRune.svelte` to lift a rune accessor into an Observable
  that the hook can consume:

  ```svelte
  <script lang="ts">
    import { fromRune } from "$lib/utils/store/fromRune.svelte";
    import { useShow } from "./useShow";

    const { params }: PageProps = $props();
    const slug$ = fromRune(() => params.slug);
    const { show, intl, isLoading } = useShow(slug$);
  </script>
  ```

  `fromRune` uses `$effect.pre` (not `$effect`) so the Observable updates BEFORE
  the component's own `$effect.pre` callbacks run. Otherwise a consumer reading
  downstream observable values in `$effect.pre` (e.g. a route's redirect logic)
  sees the previous accessor value until the next flush.
- **For specs and other test-only static input, use `valueObservable`.**
  `valueObservable(value)` at `$test/beds/store/valueObservable` lifts a static
  value into an Observable that never completes. Prefer this over `of()`, which
  completes synchronously - completion propagates through `reactiveQueryBridge`
  and closes the outer subscriber before the QueryObserver's async fetch can
  emit.

  ```ts
  // spec
  const result = await runQuery({
    factory: () => useShow(valueObservable(ShowSiloMappedMock.slug)).show,
  });
  ```

- **Hooks that DON'T drive `useQuery` can keep bare-value signatures.**
  `useIsMe(slug: string)`, `useDangerButton(...)`, `useToggler(...)`, etc. read
  from already-shared state (`useUser`, local stores) or return pure-state
  machinery. Wrapping their consumers in `$derived` re-runs cheap glue;
  QueryObservers are not at risk. The cost-benefit of forcing Observable
  signatures on these hooks does not pay back at ~15+ existing call sites that
  would each need a `valueObservable` shim.

---

## Async data caching

- **Pick a TTL per query class, not per call site.** TanStack Query's
  `staleTime` controls how long cached data is considered fresh; `gcTime`
  controls how long inactive cached data lives before garbage collection. The
  defaults (`staleTime: 0`, `gcTime: 5 min`) favor freshness over network
  savings; override for stable data.
  [TanStack: important defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults),
  [TanStack: QueryClient](https://tanstack.com/query/latest/docs/reference/QueryClient).
- **Survive transient unsubscribe.** When a query observer briefly drops to zero
  subscribers (route change, conditional render flip) and then reattaches, you
  do not want a full restart. `gcTime` keeps the cached data alive; on the rxjs
  side, `share` with a delayed `resetOnRefCountZero` keeps the upstream pipeline
  warm for the same window.
  [TanStack: important defaults](https://tanstack.com/query/v5/docs/framework/react/guides/important-defaults).
- **Prefer prefetch over viewport-gated fetch for below-the-fold data the user
  is _likely_ to reach.** Below-the-fold lists fetched eagerly are usually ready
  before the user scrolls, avoiding a spinner. Reserve viewport-gating for data
  the user is _unlikely_ to reach, or for fetches expensive enough to
  demonstrably hurt initial paint.
  [TanStack: prefetching](https://tanstack.com/query/v5/docs/framework/react/guides/prefetching).
- **Invalidate from the mutation, not on a poll.** Use
  `queryClient.invalidateQueries({ predicate })` from the write site rather than
  polling timers on the read site. Polling is a last resort for data without a
  write hook (push notifications, external sync).
  [TanStack: query invalidation](https://tanstack.com/query/v5/docs/framework/react/guides/query-invalidation).
- **Bound any retry or poll loop.** A retry-until-success loop without a ceiling
  becomes a runaway tab when the source fails for a structural reason. Cap
  retries and back off; cap polls at a session-scoped count.
  [TanStack: window-focus refetching](https://tanstack.com/query/v5/docs/framework/react/guides/window-focus-refetching).
- **Seed lists from a parent query's data with `initialData` when the shape
  allows it.** Avoids a second network round-trip for a detail view that the
  list already rendered.
  [TanStack: initial query data](https://tanstack.com/query/v5/docs/framework/react/guides/initial-query-data).

---

## Bundle & critical render path

- **Defer third-party JS that isn't needed for first paint.** Use the `defer`
  attribute (executes after parse, in document order) or dynamic `import()` from
  inside an idle callback / `load` event. Avoid `async` for code that depends on
  document state.
  [MDN: `<script>` `defer` / `async`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script).
- **Defer non-critical CSS** by attaching it with `media="print"` and swapping
  to `"all"` on load. In Svelte 5 the handler must be an expression
  (`onload={(e) => ...}`); the legacy HTML-string form doesn't compile.
  [web.dev: Defer non-critical CSS](https://web.dev/articles/defer-non-critical-css).
- **Code-split at route boundaries.** SvelteKit and Vite already split per
  route; resist adding manual `import()` calls that fragment a route's main
  chunk further. Those generally cost more in HTTP round-trips than they save in
  initial bytes. [Vite: build features](https://vite.dev/guide/build).
- **For sampled third-party SDKs, sample at the loader, not just in the SDK
  config.** A `sessionSampleRate: 0.1` setting inside an SDK still downloads and
  initializes the SDK for 100% of users; only the recording is skipped. Gate the
  dynamic `import()` itself with a `Math.random() < N` check so the unsampled
  cohort never pays the bundle cost.
  [web.dev: Reduce JavaScript payloads with code splitting](https://web.dev/articles/reduce-javascript-payloads-with-code-splitting).
- **Self-host or preconnect to font sources** and prefer `font-display: swap`
  (or `optional` for non-critical fonts) so text is rendered with a fallback
  while the web font loads.
  [web.dev: Avoid invisible text during font loading](https://web.dev/articles/avoid-invisible-text).

---

## Images

- **Always set explicit `width` and `height` on `<img>`** so the browser can
  reserve the correct aspect-ratio box before the image loads. Eliminates CLS
  and makes native lazy loading viable.
  [web.dev: Optimize CLS - images without dimensions](https://web.dev/articles/optimize-cls#images_without_dimensions).
- **Pair `loading="lazy"` with `decoding="async"`** on every non-LCP image.
  Async decode keeps long decodes off the main thread; lazy defers
  below-the-fold fetches.
  [MDN: `img` loading](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#loading),
  [MDN: `img` decoding](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#decoding).
- **Serve responsive variants with `srcset` + `sizes`.** Let the browser pick
  the right resolution per viewport / DPR; do not ship a 1600 px cover to a 320
  px mobile viewport.
  [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images).
- **Use `<picture>` for art direction or format fallbacks** (different crops by
  viewport, AVIF/WebP fallback to JPEG). Order sources from most-preferred to
  least: `<source type="image/avif">`, then `<source type="image/webp">`, then
  the JPEG/PNG `<img>` baseline.
  [MDN: `<picture>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture).
- **Don't render content images with `background-image`.** Background images
  lack `alt`, `srcset`, native lazy loading, and decode hints, and they aren't
  visible to screen readers or LCP detection. Reserve CSS backgrounds for
  decorative patterns.
  [web.dev: Optimize LCP](https://web.dev/articles/optimize-lcp).

---

## Test-side discipline

- **Flush a frame after dispatching synthetic events that trigger rAF-coalesced
  handlers.** Pattern:
  `await new Promise(r => requestAnimationFrame(() => r()))`. Otherwise the
  assertion runs before the queued callback fires and the test flickers.
  [MDN: `requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame).
- **An `IntersectionObserver` test mock must fire its callback with the actual
  `target` passed to `observe()`,** not a freshly-created element. Production
  code that uses a shared observer pool looks callbacks up by `entry.target`;
  mocks that synthesise a new `<div>` per construction silently swallow every
  hit.
  [W3C: Intersection Observer](https://www.w3.org/TR/intersection-observer/).
- **Don't simulate observer behavior with `setTimeout`.** Time-based fakes drift
  under vitest's fake timers and hide ordering bugs. Mock the observer's surface
  (`observe`, `unobserve`, `disconnect`) and invoke its callback synchronously
  from the mock; vitest will await microtasks naturally.
  [Vitest: Mocking](https://vitest.dev/guide/mocking).
- **When the production change adds a delay (rAF, debounce, idle callback),
  update the spec in the same commit.** A spec that passed on synchronous
  behavior and silently fails on async is a worse signal than a spec that
  explicitly waits for the new boundary.

---

## Honest tradeoffs

The category most likely to introduce regressions in the name of performance.
Apply skeptically.

- **Don't viewport-gate a list's _fetch_ just because it's below the fold.**
  Browsers handle a handful of parallel queries fine, and a modest upfront fetch
  primes the cache so the list renders instantly when the user scrolls.
  Render-gating (`content-visibility: auto`) is the cheaper, safer optimization
  for the same goal.
  [web.dev: `content-visibility`](https://web.dev/articles/content-visibility).
- **Don't defer mounting context providers behind `requestIdleCallback` for boot
  speed.** Mount cost is small; the race against an early user interaction
  (first 500 ms) that hits a not-yet-mounted provider and silently no-ops is a
  real regression.
- **`scaleX` on a progress bar breaks the right-edge corner radius.** See the
  animation section for the proper alternatives.
- **Don't micro-optimize cold paths.** A `shareReplay` on a stream with one
  subscriber emitting ten times per session saves nothing measurable. Optimize
  hot paths (per-frame, per-keystroke, per-scroll) and surfaces that show up in
  profiling, not branches that "feel expensive" by inspection.
- **Verify before declaring a win.** Local feel is not a measurement. Compare in
  DevTools Performance / Lighthouse / Core Web Vitals real user monitoring
  before and after, on the affected interaction. If you can't show the delta,
  the optimization may not exist.
  [web.dev: User-centric performance metrics](https://web.dev/articles/user-centric-performance-metrics).
- **Check whether the library already handles the optimization.** Wrapping a
  debug-only component in a `dev` gate is dead weight if the component already
  self-gates on `dev` internally. Read the library code before adding a
  hand-rolled gate around it.

---

## When in doubt

1. Profile first. Chrome DevTools Performance panel + Core Web Vitals RUM beat
   intuition. [web.dev: Core Web Vitals](https://web.dev/articles/vitals).
2. Move the heavy work off the main thread (worker, idle callback, compositor)
   instead of trying to make it faster on it.
3. Defer below-the-fold _rendering_ before deferring below-the-fold _data_.
4. When two optimizations contradict, pick the one easier to reverse if
   measurements disagree later.
