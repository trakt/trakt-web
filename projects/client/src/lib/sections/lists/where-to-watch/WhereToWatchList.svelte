<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import type { MetaInfoProps } from "$lib/sections/summary/components/media/useMediaMetaInfo";
  import { slide } from "svelte/transition";
  import JustWatchInfo from "./_internal/JustWatchInfo.svelte";
  import { useWhereToWatch } from "./_internal/useWhereToWatch";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    streamOn,
    ...target
  }: MetaInfoProps & {
    streamOn?: StreamOn;
  } = $props();

  const { services } = $derived(useWhereToWatch({ streamOn, ...target }));
</script>

{#if $services.length > 0}
  {#snippet metaInfo()}
    <JustWatchInfo {...target} />
  {/snippet}

  <div transition:slide={{ duration: 150 }}>
    <SectionList
      id={`where-to-watch-${target.media.slug}`}
      items={$services}
      title={m.list_title_where_to_watch()}
      {metaInfo}
      --height-list="var(--height-where-to-watch-list)"
    >
      {#snippet item(service)}
        <WhereToWatchItem {service} />
      {/snippet}
    </SectionList>
  </div>
{/if}
