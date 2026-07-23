<script lang="ts">
  import type { ListVariant } from "$lib/components/lists/section-list/ListVariant";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { usePlexLibrary } from "$lib/features/plex/usePlexLibrary";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import {
    summaryDrawerNavigation,
    SummaryDrawers,
  } from "$lib/sections/summary/_internal/summaryDrawerNavigation";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { hasAired } from "$lib/utils/media/hasAired";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { mapToServices } from "./_internal/mapToServices";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    streamOn,
    variant,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
    variant?: ListVariant;
  } = $props();

  const { buildDrawerLink } = summaryDrawerNavigation();
  const justWatchServices = $derived(mapToServices(streamOn));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);

  const { plexServices } = $derived(usePlexLibrary(target));

  const services = $derived.by(() => {
    if (!$isMobile) {
      return justWatchServices;
    }

    return [...$plexServices, ...justWatchServices];
  });

  const { country } = useStreamingPreferences();

  const isAired = $derived.by(() => {
    switch (target.type) {
      case "movie":
      case "show":
        return hasAired(target.media);
      case "episode":
        return hasAired(target.episode);
    }
  });
</script>

{#snippet metaInfo()}
  <JustWatchInfo {...target} rank={streamOn?.services?.streamingRank} />
{/snippet}

{#if isAired}
  <div
    transition:slide={{ duration: 150 }}
    class="trakt-where-to-watch-list"
    class:is-inline={variant === "inline"}
  >
    <SectionList
      id={{
        scope: `where-to-watch-list-${target.type}`,
        key: target.media.slug,
      }}
      items={services}
      title={m.list_title_where_to_watch()}
      drilldown={{
        ...buildDrawerLink(SummaryDrawers.WhereToWatch),
        source: { id: "where-to-watch" },
        label: m.button_label_view_all_where_to_watch(),
        mode: "always",
      }}
      {metaInfo}
      {variant}
      --height-list="var(--height-where-to-watch-list)"
    >
      {#snippet item(service)}
        <WhereToWatchItem {service} country={$country} />
      {/snippet}

      {#snippet empty()}
        <p class="secondary">{m.button_text_no_services()}</p>
      {/snippet}
    </SectionList>
  </div>
{/if}

<style>
  .trakt-where-to-watch-list {
    /* The default is overridden because the meta info has an icon and needs a bigger gap */
    :global(.trakt-list-title) {
      gap: var(--gap-xs);
    }

    &.is-inline {
      container-type: inline-size;

      /*
       * The desktop summary column is a fixed-width inline rail. Fit exactly
       * three services inside it so a fourth card never peeks through the
       * unmasked inline scroller.
       */
      --where-to-watch-item-count: 3;
      --where-to-watch-rail-width: calc(100cqi - 2 * var(--ni-2));
      --width-where-to-watch-item: calc(
        (
            var(--where-to-watch-rail-width) -
              (var(--where-to-watch-item-count) - 1) *
              var(--list-gap)
          ) /
          var(--where-to-watch-item-count)
      );
    }
  }
</style>
