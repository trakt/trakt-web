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
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import { distinctUntilChanged } from "rxjs";
  import { onMount } from "svelte";
  import { MAX_MIXTAPE_PICKS } from "./_internal/MAX_MIXTAPE_PICKS.ts";
  import MixtapeActionBar from "./_internal/MixtapeActionBar.svelte";
  import MixtapePicker from "./_internal/MixtapePicker.svelte";
  import MixtapeResults from "./_internal/MixtapeResults.svelte";
  import MixtapeTray from "./_internal/MixtapeTray.svelte";
  import { parseMixtapeParams } from "./_internal/parseMixtapeParams.ts";
  import { toMixtapeSlots } from "./_internal/toMixtapeSlots.ts";
  import { toPickerItems } from "./_internal/toPickerItems.ts";
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
  const { history, picked, isHistoryLoading, mixtape, isMixtapeLoading } =
    useMixtape(request$);

  let query = $state("");

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
      picks: params.picks,
      fits: $mixtape.fits,
      query,
    }),
  );
  const isPickerLoading = $derived(
    $isHistoryLoading || (picker.kind === "fits" && $isMixtapeLoading),
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

  const replaceSkips = (skips: ReadonlyArray<number>) =>
    // eslint-disable-next-line svelte/no-navigation-without-resolve
    goto(href({ view: "results", skips: [...skips] }), {
      replaceState: true,
      noScroll: true,
      keepFocus: true,
    });

  onMount(() => {
    trackOpen({ source: params.source ?? "direct", type: params.type });
  });

  let reportedNoFits = "";
  $effect(() => {
    const key = `${params.type}:${params.picks.join()}`;
    const ranOut =
      picker.kind === "fits" &&
      !isPickerLoading &&
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
    onSkip={(id) => replaceSkips([...params.skips, id])}
    onUndo={() => replaceSkips(params.skips.slice(0, -1))}
    onMore={(ids) => replaceSkips([...params.skips, ...ids])}
    onResult={(action, position) =>
      trackResult({ action, position: String(position), type: params.type })}
  />
{:else}
  <div class="trakt-mixtape">
    <header class="mixtape-header">
      <div class="mixtape-title">
        <span class="mixtape-icon"><CassetteIcon /></span>
        <h2>{m.page_title_mixtape()}</h2>
      </div>
      <SegmentedSelect
        options={typeOptions}
        value={params.type}
        ariaLabel={m.page_title_mixtape()}
        onChange={() => (query = "")}
      >
        {#snippet icon(option)}
          <ToggleIcon {option} />
        {/snippet}
      </SegmentedSelect>
    </header>

    <p class="secondary mixtape-description">
      {params.type === "show"
        ? m.text_mixtape_description_shows()
        : m.text_mixtape_description_movies()}
    </p>

    <div class="mixtape-controls">
      <MixtapeTray
        picks={params.picks}
        picked={$picked}
        removeHref={(id) =>
          href({ picks: params.picks.filter((pick) => pick !== id) })}
      />
      <DrawerSearchInput
        bind:value={query}
        label={m.input_label_mixtape_search()}
        placeholder={params.type === "show"
          ? m.input_placeholder_mixtape_search_shows()
          : m.input_placeholder_mixtape_search_movies()}
      />
    </div>

    <div class="mixtape-grid-head">
      <h3>
        {picker.kind === "search"
          ? m.header_mixtape_search_results()
          : picker.kind === "fits"
            ? m.header_mixtape_fits()
            : params.type === "show"
              ? m.header_mixtape_recent_shows()
              : m.header_mixtape_recent_movies()}
      </h3>
      {#if picker.kind === "fits" && !isPickerLoading}
        <span class="small secondary">
          {m.text_mixtape_fits_count({ count: String(picker.items.length) })}
        </span>
      {/if}
    </div>

    <MixtapePicker
      {picker}
      isLoading={isPickerLoading}
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

    <MixtapeActionBar
      pickCount={params.picks.length}
      clearHref={UrlBuilder.mixtape({ type: params.type })}
      mixHref={href({ view: "results" })}
      onMix={() =>
        trackMix({
          type: params.type,
          picks: params.picks.length,
          fits: $mixtape.fits.length,
        })}
    />
  </div>
{/if}

<style lang="scss">
  .trakt-mixtape {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    padding-block-start: var(--gap-m);

    .mixtape-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);
      padding-inline: var(--layout-distance-side);
    }

    .mixtape-title {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      h2 {
        margin: 0;
      }
    }

    .mixtape-icon {
      display: flex;
      color: var(--color-text-emphasis);
    }

    .mixtape-description {
      margin: 0;
      padding-inline: var(--layout-distance-side);
      max-width: var(--ni-520);
    }

    .mixtape-controls {
      display: flex;
      flex-direction: column;
      gap: var(--gap-m);
      padding-inline: var(--layout-distance-side);
      max-width: var(--ni-520);
    }

    .mixtape-grid-head {
      display: flex;
      align-items: baseline;
      gap: var(--gap-xs);
      padding-inline: var(--layout-distance-side);

      h3 {
        margin: 0;
      }
    }
  }
</style>
