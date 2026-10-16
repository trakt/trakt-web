<script lang="ts">
  import { page } from "$app/state";
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
  import { toMixtapeResults } from "./_internal/toMixtapeResults.ts";
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
  const results = $derived(toMixtapeResults($mixtape.suggestions, params.skips));

  const titleOf = (id: number) =>
    $picked.find((media) => media.id === id)?.title ?? null;
  const pickTitles = $derived($picked.map((media) => media.title));

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

<div class="trakt-mixtape">
  <header class="mixtape-header">
    <div class="mixtape-heading">
      <h2>
        {params.view === "results"
          ? m.header_mixtape_results()
          : m.page_title_mixtape()}
      </h2>
      {#if params.view === "pick"}
        <p class="secondary">
          {params.type === "show"
            ? m.text_mixtape_description_shows()
            : m.text_mixtape_description_movies()}
        </p>
      {/if}
    </div>
    {#if params.view === "pick"}
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
    {/if}
  </header>

  {#if params.view === "results"}
    <MixtapeResults
      {results}
      isLoading={$isMixtapeLoading}
      {pickTitles}
      {titleOf}
      skipHref={(id) =>
        href({ view: "results", skips: [...params.skips, id] })}
      changeHref={href({})}
      startOverHref={UrlBuilder.mixtape({ type: params.type })}
      onResult={(action, position) =>
        trackResult({ action, position: String(position), type: params.type })}
    />
  {:else}
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
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);

    .mixtape-header {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--gap-m);
      padding-inline: var(--layout-distance-side);
    }

    .mixtape-heading {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
      min-width: 0;
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
      padding-inline: var(--layout-distance-side);
    }
  }
</style>
