<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type {
    StreamNow,
    StreamingServiceOptions,
  } from "$lib/requests/models/StreamingServiceOptions";
  import DetailsGrid from "./_internal/DetailsGrid.svelte";
  import StreamingServiceCategory from "./_internal/StreamingServiceCategory.svelte";

  type MediaStreamingServicesProps = {
    services?: StreamingServiceOptions;
    preferred?: StreamNow;
  };

  const { services, preferred }: MediaStreamingServicesProps = $props();

  const streaming = $derived(
    (services?.streaming ?? []).filter((service) => service !== preferred),
  );
  const onDemand = $derived(services?.onDemand ?? []);

  const hasServices = $derived(streaming.length || onDemand.length);
</script>

{#if hasServices}
  <DetailsGrid title={m.header_stream_on()} isCollapsable={true}>
    {#if streaming.length > 0}
      <StreamingServiceCategory
        title={m.header_streaming()}
        services={streaming}
      />
    {/if}
    {#if onDemand.length > 0}
      <StreamingServiceCategory
        title={m.header_on_demand()}
        services={onDemand}
      />
    {/if}
  </DetailsGrid>
{/if}
