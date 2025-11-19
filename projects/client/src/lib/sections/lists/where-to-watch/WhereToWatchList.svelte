<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import { hasAired } from "$lib/sections/media-actions/_internal/hasAired";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { useStreamingPreferences } from "$lib/stores/useStreamingPreferences";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { useWhereToWatch } from "./_internal/useWhereToWatch";
  import WhereToWatchDrawer from "./_internal/WhereToWatchDrawer.svelte";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    streamOn,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
  } = $props();

  const { services } = $derived(useWhereToWatch({ streamOn, ...target }));
  const { country } = useStreamingPreferences();

  const isAired = $derived.by(() => {
    switch (target.type) {
      case "movie":
        return hasAired({ type: "movie", status: target.media.status });
      case "show":
        return hasAired({ type: "show", airDate: target.media.airDate });
      case "episode":
        return hasAired({
          type: target.type,
          airDate: target.episode.airDate,
        });
    }
  });
</script>

{#snippet metaInfo()}
  <JustWatchInfo {...target} />
{/snippet}

{#if isAired}
  <div transition:slide={{ duration: 150 }}>
    <SectionList
      id={`where-to-watch-${target.media.slug}`}
      items={$services}
      title={m.list_title_where_to_watch()}
      {metaInfo}
      --height-list="var(--height-where-to-watch-list)"
    >
      {#snippet item(service)}
        <WhereToWatchItem {service} country={$country} />
      {/snippet}

      {#snippet empty()}
        <p class="secondary">{m.button_text_no_services()}</p>
      {/snippet}

      {#snippet actions()}
        <WhereToWatchDrawer {...target} />
      {/snippet}
    </SectionList>
  </div>
{/if}
