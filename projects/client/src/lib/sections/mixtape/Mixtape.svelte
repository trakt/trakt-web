<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import CassetteIcon from "$lib/components/icons/CassetteIcon.svelte";
  import SegmentedSelect from "$lib/components/select/SegmentedSelect.svelte";
  import ToggleIcon from "$lib/components/toggles/ToggleIcon.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import { useDiscover } from "$lib/features/filters/useDiscover.ts";
  import DrawerSearchInput from "$lib/components/drawer/DrawerSearchInput.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { MediaInputDefault } from "$lib/models/MediaInput.ts";
  import type { MediaType } from "$lib/requests/models/MediaType.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { distinctUntilChanged, map, scan } from "rxjs";
  import { onMount } from "svelte";
  import { holdSettledPicker } from "./_internal/holdSettledPicker.ts";
  import { MAX_MIXTAPE_PICKS } from "./_internal/MAX_MIXTAPE_PICKS.ts";
  import MixtapeActionBar from "./_internal/MixtapeActionBar.svelte";
  import MixtapePicker from "./_internal/MixtapePicker.svelte";
  import MixtapeResults from "./_internal/MixtapeResults.svelte";
  import MixtapeTray from "./_internal/MixtapeTray.svelte";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { toMixtapeSlots } from "./_internal/toMixtapeSlots.ts";
  import { toPickerItems } from "./_internal/toPickerItems.ts";
  import type { MixtapeTarget } from "./_internal/MixtapeTarget.ts";
  import { useMixtapeSave } from "./_internal/useMixtapeSave.ts";
  import { useMixtape } from "./useMixtape.ts";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry.ts";
  import type { ShowEntry } from "$lib/requests/models/ShowEntry.ts";

  const params = $derived(parseMixtapeParams(page.url.searchParams));
  const request$ = fromRune(() => ({
    type: params.type,
    picks: params.picks,
  })).pipe(
    distinctUntilChanged(
      (a, b) => a.type === b.type && a.picks.join() === b.picks.join(),
    ),
  );
  let query = $state("");

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
  } = useMixtape(request$, fromRune(() => query));

  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  let searchBox = $state<HTMLDivElement>();

  const { track: trackOpen } = useTrack(AnalyticsEvent.MixtapeOpen);
  const { track: trackPick } = useTrack(AnalyticsEvent.MixtapePick);
  const { track: trackNoFits } = useTrack(AnalyticsEvent.MixtapeNoFits);
  const { track: trackMix } = useTrack(AnalyticsEvent.MixtapeMix);
  const { track: trackResult } = useTrack(AnalyticsEvent.MixtapeResult);

  const { options } = useDiscover();
  const typeOptions = $derived(
    options
      .filter((option): option is typeof option & { value: MediaType } =>
        option.value === "movie" || option.value === "show",
      )
      .map((option) => ({
        value: option.value,
        text: option.text(),
        label: option.label(),
        href: UrlBuilder.mixtape({ type: option.value }),
      })),
  );

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

  const { keep } = useMixtapeSave();

  const replaceResults = (
    overrides: {
      skips?: ReadonlyArray<number>;
      kept?: ReadonlyArray<ReadonlyArray<number>>;
      savedTo?: MixtapeTarget;
    },
  ) => {
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
        const suggestion = $mixtape.suggestions.find(
          ({ media }) => media.id === id,
        );
        return suggestion ? [suggestion.media] : [];
      }),
    ),
  );

  const keepMedia = async (media: MovieEntry | ShowEntry) => {
    const finished = params.kept.slice(0, -1);
    const current = params.kept.at(-1) ?? [];
    const saving = keep(params.savedTo, media);
    if (params.savedTo != null && !(await saving)) return;
    replaceResults({ kept: [...finished, [...current, media.id]] });
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
      picker.items.length === 0;
    if (!ranOut || reportedNoFits === key) return;
    reportedNoFits = key;
    trackNoFits({ type: params.type, picks: params.picks.length });
  });
</script>

{#if params.view === "results"}
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
  <div class="trakt-mixtape">
    <header class="mixtape-header">
      <div class="mixtape-title-row">
        <h2 class="mixtape-headline">
          <span class="mixtape-icon"><CassetteIcon /></span>
          {m.page_title_mixtape()}
        </h2>
        <SegmentedSelect
          options={typeOptions}
          value={params.type}
          variant={$isMobile ? "selected-label" : "regular"}
          ariaLabel={m.page_title_mixtape()}
          onChange={() => (query = "")}
        >
          {#snippet icon(option)}
            <ToggleIcon {option} />
          {/snippet}
        </SegmentedSelect>
      </div>
      <p class="secondary mixtape-description">
        {params.type === "show"
          ? m.text_mixtape_description_shows()
          : m.text_mixtape_description_movies()}
      </p>
    </header>

    <section class="mixtape-browse">
      <div class="mixtape-grid-head">
        <h3>
          {shownPicker.kind === "search"
            ? m.header_mixtape_search_results()
            : shownPicker.kind === "fits"
              ? m.header_mixtape_fits()
              : params.type === "show"
                ? m.header_mixtape_recent_shows()
                : m.header_mixtape_recent_movies()}
        </h3>
        {#if shownPicker.kind === "fits" && !isPickerLoading}
          <span class="small secondary">
            {m.text_mixtape_fits_count({
              count: String(shownPicker.items.length),
            })}
          </span>
        {/if}
      </div>

      <div class="mixtape-search" bind:this={searchBox}>
        <DrawerSearchInput
          bind:value={query}
          label={m.input_label_mixtape_search()}
          placeholder={params.type === "show"
            ? m.input_placeholder_mixtape_search_shows()
            : m.input_placeholder_mixtape_search_movies()}
        />
      </div>

      <MixtapePicker
        picker={shownPicker}
        isLoading={isPickerLoading}
        {isSettling}
        {isFull}
        pickHref={(media: MediaInputDefault) =>
          href({ picks: [...params.picks, media.id] })}
        onPick={(source) => {
          query = "";
          trackPick({
            source,
            type: params.type,
            picks: params.picks.length + 1,
          });
        }}
      />
    </section>

    <div class="mixtape-dock">
      <MixtapeActionBar
        pickCount={params.picks.length}
        clearHref={UrlBuilder.mixtape({ type: params.type })}
        mixHref={href({ view: "results" })}
        onMix={() =>
          trackMix({
            type: params.type,
            picks: params.picks.length,
            fits: $fits.length,
          })}
      >
        <MixtapeTray
          picks={params.picks}
          picked={$picked}
          removeHref={(id) =>
            href({ picks: params.picks.filter((pick) => pick !== id) })}
          onAdd={() => searchBox?.querySelector("input")?.focus()}
        />
      </MixtapeActionBar>
    </div>
  </div>
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-mixtape {
    --mixtape-content-width: var(--ni-520);

    box-sizing: border-box;
    min-height: 100dvh;

    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .mixtape-header {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      padding-block-start: var(--ni-10);

      @include for-tablet-sm-and-below {
        padding-block-start: var(--ni-16);
      }
    }

    .mixtape-title-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
    }

    .mixtape-headline {
      display: flex;
      align-items: center;
      gap: var(--gap-s);
      margin: 0;

      font-size: var(--ni-40);
      line-height: 1;
      letter-spacing: -0.02em;

      @include for-mobile {
        font-size: var(--ni-28);
      }
    }

    .mixtape-icon {
      display: flex;
      color: var(--color-text-emphasis);

      :global(svg) {
        width: 1em;
        height: 1em;
      }
    }

    .mixtape-description {
      margin: 0;
      max-width: var(--mixtape-content-width);
    }

    .mixtape-header,
    .mixtape-search,
    .mixtape-grid-head {
      padding-inline: var(--layout-distance-side);
    }

    .mixtape-search {
      max-width: var(--mixtape-content-width);
    }

    .mixtape-browse {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
    }

    .mixtape-grid-head {
      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);

      h3 {
        margin: 0;
      }
    }

    .mixtape-dock {
      position: sticky;
      inset-block-end: 0;
      z-index: var(--layer-floating);

      box-sizing: border-box;
      width: 100%;
      max-width: calc(
        var(--mixtape-content-width) + 2 * var(--layout-distance-side)
      );
      margin-block-start: auto;
      margin-inline: auto;
      padding: var(--gap-s) var(--layout-distance-side);
      padding-block-end: calc(var(--gap-s) + env(safe-area-inset-bottom));

      @include for-tablet-sm-and-below {
        inset-block-end: var(--mobile-navbar-height);
        padding-block-end: var(--gap-s);
      }
    }
  }
</style>
