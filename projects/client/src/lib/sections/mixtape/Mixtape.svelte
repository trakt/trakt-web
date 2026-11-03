<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import ResetFiltersIcon from "$lib/components/icons/ResetFiltersIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { MediaInputDefault } from "$lib/models/MediaInput.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import {
    combineLatest,
    concat,
    distinctUntilChanged,
    map,
    of,
    scan,
    switchMap,
    timer,
  } from "rxjs";
  import { onDestroy, onMount } from "svelte";
  import { holdSettledPicker } from "./_internal/holdSettledPicker.ts";
  import { MAX_MIXTAPE_PICKS } from "./_internal/MAX_MIXTAPE_PICKS.ts";
  import { MIX_HOLD_DURATION } from "./_internal/MIX_HOLD_DURATION.ts";
  import MixtapeHeaderButton from "./_internal/MixtapeHeaderButton.svelte";
  import MixtapePicker from "./_internal/MixtapePicker.svelte";
  import MixtapeResults from "./_internal/MixtapeResults.svelte";
  import type { MixtapeTarget } from "./_internal/MixtapeTarget.ts";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { toMixtapeSlots } from "./_internal/toMixtapeSlots.ts";
  import { toPickerItems } from "./_internal/toPickerItems.ts";
  import { useMixtapeSave } from "./_internal/useMixtapeSave.ts";
  import { useMixtapeSession } from "./_internal/useMixtapeSession.ts";
  import MixtapeNavbarDeck from "./MixtapeNavbarDeck.svelte";
  import { useMixtape } from "./useMixtape.ts";

  const params = $derived(parseMixtapeParams(page.url.searchParams));
  const request$ = fromRune(() => ({
    type: params.type,
    picks: params.picks,
  })).pipe(
    distinctUntilChanged(
      (a, b) => a.type === b.type && a.picks.join() === b.picks.join(),
    ),
  );

  const { session, update, reset, launch } = useMixtapeSession();
  const search$ = session.pipe(
    map(({ search }) => search),
    distinctUntilChanged(),
  );
  const query = $derived($session.search);

  const {
    history,
    searchResults,
    isSearchLoading,
    picked,
    known,
    fits,
    isFitsSettling,
    isHistoryLoading,
    mixtape,
    isMixtapeLoading,
  } = useMixtape(request$, search$);

  const isReducedMotion = useMedia(WellKnownMediaQuery.reducedMotion);

  const { track: trackOpen } = useTrack(AnalyticsEvent.MixtapeOpen);
  const { track: trackPick } = useTrack(AnalyticsEvent.MixtapePick);
  const { track: trackNoFits } = useTrack(AnalyticsEvent.MixtapeNoFits);
  const { track: trackResult } = useTrack(AnalyticsEvent.MixtapeResult);

  const href = (overrides: Parameters<typeof UrlBuilder.mixtape>[0]) =>
    UrlBuilder.mixtape({
      type: params.type,
      picks: params.picks,
      source: params.source ?? undefined,
      ...overrides,
    });

  const picker = $derived(
    toPickerItems({
      history: $history,
      searchResults: $searchResults,
      fitMedia: $known,
      picked: $picked,
      picks: params.picks,
      fits: $fits,
      query,
    }),
  );
  const isSettling = $derived(picker.kind === "fits" && $isFitsSettling);
  const heldPicker$ = fromRune(() => ({
    picker,
    isSettling,
    isHistoryLoading: $isHistoryLoading,
  })).pipe(
    scan(holdSettledPicker<MediaInputDefault>, null),
    map((held) => held?.shown),
  );
  const shownPicker = $derived($heldPicker$ ?? picker);
  const isPickerLoading = $derived(
    $isHistoryLoading ||
      (isSettling && shownPicker === picker) ||
      (picker.kind === "search" &&
        picker.items.length === 0 &&
        $isSearchLoading),
  );
  const isFull = $derived(params.picks.length >= MAX_MIXTAPE_PICKS);
  const isResults = $derived(params.view === "results");
  const slotsLeft = $derived(MAX_MIXTAPE_PICKS - params.picks.length);

  /*
    The hold re-arms only when the view itself changes: a keep or a swap
    rewrites the results url too, and must not send the stage back into
    the mixing theatre.
  */
  const isHolding$ = combineLatest([
    fromRune(() => params.view).pipe(distinctUntilChanged()),
    isReducedMotion,
  ]).pipe(
    switchMap(([view, isReduced]) =>
      view === "results"
        ? concat(
            of(true),
            timer(isReduced ? 0 : MIX_HOLD_DURATION).pipe(map(() => false)),
          )
        : of(false),
    ),
  );
  const isMixing = $derived(isResults && ($isHolding$ || $isMixtapeLoading));
  const isShowingResults = $derived(isResults && !isMixing);
  const phase = $derived(isMixing ? "mixing" : isFull ? "full" : "pick");

  $effect(() => {
    update({ picked: $picked, fitCount: $fits.length, isMixing });
  });

  onDestroy(reset);

  const subtitle = $derived.by(() => {
    if (isMixing) return m.text_mixtape_mixing();
    if (isResults) {
      return params.picks.length === 1
        ? m.text_mixtape_mixed_from_picks_one()
        : m.text_mixtape_mixed_from_picks({ count: params.picks.length });
    }
    if (isFull) return m.text_mixtape_deck_loaded();
    return params.type === "show"
      ? m.text_mixtape_deck_prompt_shows({ max: MAX_MIXTAPE_PICKS })
      : m.text_mixtape_deck_prompt_movies({ max: MAX_MIXTAPE_PICKS });
  });

  const gridHead = $derived.by(() => {
    if (isMixing) return m.header_mixtape_mixing();
    if (isFull) return m.header_mixtape_deck_full();
    if (shownPicker.kind === "search") return m.header_mixtape_search_results();
    if (shownPicker.kind === "fits") return m.header_mixtape_fits();
    return params.type === "show"
      ? m.header_mixtape_recent_shows()
      : m.header_mixtape_recent_movies();
  });

  const gridMeta = $derived.by(() => {
    if (isMixing || isFull) return null;
    return slotsLeft === 1
      ? m.text_mixtape_slots_left_one()
      : m.text_mixtape_slots_left({ count: slotsLeft });
  });

  const slots = $derived(toMixtapeSlots($mixtape.suggestions, params.skips));
  const canSwap = $derived(
    $mixtape.suggestions.some(
      ({ media }) =>
        !params.skips.includes(media.id) &&
        !slots.some((slot) => slot.media.id === media.id),
    ),
  );

  const titleOf = (id: number) =>
    $picked.find((media) => media.id === id)?.title ?? null;

  const suggestionOf = (id: number) =>
    $mixtape.suggestions.find(({ media }) => media.id === id) ?? null;

  const { keep } = useMixtapeSave();

  const replaceResults = (overrides: {
    skips?: ReadonlyArray<number>;
    kept?: ReadonlyArray<ReadonlyArray<number>>;
    savedTo?: MixtapeTarget;
  }) => {
    const url = href({
      view: "results",
      skips: params.skips,
      kept: params.kept,
      savedTo: params.savedTo,
      ...overrides,
    });
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    return goto(url, { replaceState: true, noScroll: true, keepFocus: true });
  };

  const rounds = $derived(
    params.kept.map((ids) =>
      ids.flatMap((id) => {
        const suggestion = suggestionOf(id);
        return suggestion ? [suggestion.media] : [];
      }),
    ),
  );

  let pendingKeep: Promise<unknown> = Promise.resolve();

  const recordKeep = async (
    media: MovieEntry | ShowEntry,
    saved: Promise<boolean> | null,
  ) => {
    if (saved && !(await saved)) return;
    const finished = params.kept.slice(0, -1);
    const current = params.kept.at(-1) ?? [];
    await replaceResults({ kept: [...finished, [...current, media.id]] });
  };

  const keepMedia = (media: MovieEntry | ShowEntry) => {
    const saving = keep(params.savedTo, media);
    const saved = params.savedTo != null ? saving : null;
    const recorded = pendingKeep.then(() => recordKeep(media, saved));
    pendingKeep = recorded.catch(() => undefined);
    return recorded;
  };

  const pick = (
    source: "grid" | "search",
    media: MediaInputDefault,
    from: DOMRect | null,
  ) => {
    update({ search: "" });
    trackPick({
      source,
      type: params.type,
      picks: params.picks.length + 1,
    });
    launch({ id: media.id, src: media.poster.url.thumb, from });
  };

  onMount(() => {
    trackOpen({ source: params.source ?? "direct", type: params.type });
  });

  let reportedNoFits = "";
  $effect(() => {
    const key = `${params.type}:${params.picks.join()}`;
    const ranOut =
      picker.kind === "fits" &&
      !isSettling &&
      !isFull &&
      picker.items.length === params.picks.length;
    if (!ranOut || reportedNoFits === key) return;
    reportedNoFits = key;
    trackNoFits({ type: params.type, picks: params.picks.length });
  });
</script>

{#snippet subtitleContent()}
  {#key subtitle}
    <span class="mixtape-subtitle">{subtitle}</span>
  {/key}
{/snippet}

<NavbarStateSetter
  contentToggle={isResults ? "mixtape-results" : "mixtape"}
  showFilters={false}
  header={{ title: m.page_title_mixtape(), metaInfo: subtitleContent }}
>
  {#snippet headerActions()}
    <MixtapeHeaderButton
      href={UrlBuilder.mixtape({ type: params.type })}
      label={m.button_text_mixtape_start_over()}
      isDisabled={params.picks.length === 0}
      replace
    >
      <ResetFiltersIcon />
    </MixtapeHeaderButton>
    {#if isShowingResults}
      <MixtapeHeaderButton
        href={UrlBuilder.discover()}
        label={m.button_label_close()}
      >
        <CloseIcon />
      </MixtapeHeaderButton>
    {/if}
  {/snippet}
</NavbarStateSetter>

<div class="trakt-mixtape" data-phase={isShowingResults ? "results" : phase}>
  <RenderFor audience="all" device={["mobile", "tablet-sm"]}>
    <div class="mixtape-search-bar">
      <MixtapeNavbarDeck layout="docked" />
    </div>
  </RenderFor>

  {#if isShowingResults}
    <MixtapeResults
      {slots}
      {canSwap}
      isLoading={$isMixtapeLoading}
      picked={$picked}
      {titleOf}
      closeHref={UrlBuilder.discover()}
      changeHref={href({})}
      startOverHref={UrlBuilder.mixtape({ type: params.type })}
      {rounds}
      savedTo={params.savedTo}
      onKeep={keepMedia}
      matchOf={(id) => suggestionOf(id)?.match ?? null}
      becauseOf={(id) => {
        const suggestion = suggestionOf(id);
        return suggestion ? titleOf(suggestion.because) : null;
      }}
      onMoved={(savedTo) => replaceResults({ savedTo })}
      onSkip={(id) => replaceResults({ skips: [...params.skips, id] })}
      onUndo={() => replaceResults({ skips: params.skips.slice(0, -1) })}
      onMore={(ids) =>
        replaceResults({
          skips: [...params.skips, ...ids],
          kept: [...params.kept, []],
        })}
      onResult={(action, position) =>
        trackResult({ action, position: String(position), type: params.type })}
    />
  {:else}
    <section class="mixtape-browse">
      <div class="mixtape-grid-head">
        <span class="mixtape-grid-label">{gridHead}</span>
        {#if gridMeta}
          <span class="mixtape-grid-meta">{gridMeta}</span>
        {/if}
      </div>

      <MixtapePicker
        picker={shownPicker}
        isLoading={isPickerLoading}
        {isSettling}
        {phase}
        pickHref={(media) => href({ picks: [...params.picks, media.id] })}
        removeHref={(media) =>
          href({ picks: params.picks.filter((pick) => pick !== media.id) })}
        onPick={pick}
      />
    </section>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .mixtape-subtitle {
    display: block;
    color: var(--color-text-emphasis);
    font-size: var(--font-size-text-small);
    font-weight: 600;
    white-space: nowrap;

    animation: mixtape-subtitle-in calc(2 * var(--transition-increment))
      cubic-bezier(0.2, 0.8, 0.2, 1) both;
  }

  @keyframes mixtape-subtitle-in {
    from {
      opacity: 0;
      transform: translateY(var(--ni-6));
    }
  }

  .trakt-mixtape {
    box-sizing: border-box;
    min-height: 100dvh;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    /*
      Clearance for the floating dock on small screens: the tray grows a
      Mix it row once the deck is full, so the grid clears that too. The
      results stage floats its own buttons and clears them itself.
    */
    @include for-tablet-sm-and-below {
      --mixtape-dock-height: var(--ni-60);

      padding-block-end: calc(var(--mixtape-dock-height) + 2 * var(--gap-s));

      &[data-phase="full"],
      &[data-phase="mixing"] {
        --mixtape-dock-height: var(--ni-120);
      }

      &[data-phase="results"] {
        padding-block-end: 0;
      }
    }

    @include for-mobile {
      --mixtape-dock-height: var(--ni-88);

      &[data-phase="full"],
      &[data-phase="mixing"] {
        --mixtape-dock-height: var(--ni-144);
      }
    }

    /*
      The glass lives on a pseudo-element: a backdrop-filter on the bar
      itself would become the containing block of the deck's fixed slots.
    */
    .mixtape-search-bar {
      position: sticky;
      inset-block-start: calc(
        var(--navbar-height) + env(safe-area-inset-top, 0px)
      );
      z-index: var(--layer-floating);

      box-sizing: border-box;
      padding: var(--gap-xs) var(--layout-distance-side);

      &::before {
        content: "";
        position: absolute;
        inset: 0;
        z-index: -1;
        background: color-mix(
          in srgb,
          var(--color-background-navbar) 75%,
          transparent
        );
        backdrop-filter: blur(var(--ni-10));
      }
    }

    .mixtape-browse {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .mixtape-grid-head {
      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);
      min-height: var(--ni-16);
      padding-inline: var(--layout-distance-side);
    }

    .mixtape-grid-label {
      color: var(--color-text-primary);
      font-size: var(--font-size-text-small);
      font-weight: 800;
      letter-spacing: 0.14em;
      line-height: var(--ni-16);
      text-transform: uppercase;

      transition: color calc(2 * var(--transition-increment)) ease-in-out;
    }

    .mixtape-grid-meta {
      color: var(--color-text-secondary);
      font-size: var(--font-size-text-small);
      font-weight: 700;
      line-height: var(--ni-16);
    }

    &[data-phase="pick"] .mixtape-grid-label {
      color: var(--color-text-secondary);
    }
  }
</style>
