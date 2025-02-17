<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type {
    WatchNowServices,
    WatchNowStreaming,
  } from "$lib/requests/models/WatchNowServices";
  import DetailsGrid from "./DetailsGrid.svelte";
  import WatchNowCategoryServices from "./WatchNowCategoryServices.svelte";

  type MediaWatchNowSourcesProps = {
    services?: WatchNowServices;
    preferred?: WatchNowStreaming;
  };

  const { services, preferred }: MediaWatchNowSourcesProps = $props();

  const streaming = $derived(
    (services?.streaming ?? []).filter((service) => service !== preferred),
  );
  const onDemand = $derived(services?.onDemand ?? []);

  const hasServices = $derived(streaming.length || onDemand.length);
</script>

{#if hasServices}
  <DetailsGrid title={m.stream_on()} isCollapsable={true}>
    {#if streaming.length > 0}
      <WatchNowCategoryServices title={m.streaming()} services={streaming} />
    {/if}
    {#if onDemand.length > 0}
      <WatchNowCategoryServices title={m.on_demand()} services={onDemand} />
    {/if}
  </DetailsGrid>
{/if}
