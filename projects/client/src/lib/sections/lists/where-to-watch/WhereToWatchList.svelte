<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamOn } from "$lib/requests/models/StreamOn";
  import { mapToServices } from "./_internal/mapToServices";
  import WhereToWatchItem from "./_internal/WhereToWatchItem.svelte";

  const {
    slug,
    streamOn,
  }: {
    slug: string;
    streamOn?: StreamOn;
  } = $props();

  const services = $derived(mapToServices(streamOn));
</script>

{#if services.length > 0}
  <SectionList
    id={`where-to-watch-${slug}`}
    items={services}
    title={m.list_title_where_to_watch()}
    --height-list="var(--height-where-to-watch-list)"
  >
    {#snippet item(service)}
      <WhereToWatchItem {service} />
    {/snippet}
  </SectionList>
{/if}
