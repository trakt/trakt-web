<script lang="ts" generics="T extends StreamingServiceOption">
  import Link from "$lib/components/link/Link.svelte";
  import type {
    StreamingServiceOption,
    StreamOnDemand,
  } from "$lib/requests/models/StreamingServiceOptions";
  import { useStreamingServices } from "$lib/stores/useStreamingServices";
  import CollapsableValues from "./CollapsableValues.svelte";
  import { getMediaCost } from "./getMediaCost";

  type StreamingServiceCategoryServicesProps<T> = {
    title: string;
    services: T[];
  };

  const { title, services }: StreamingServiceCategoryServicesProps<T> =
    $props();

  const { sources } = useStreamingServices();

  const getServiceName = (service: StreamingServiceOption) => {
    return (
      $sources.find((s) => s.source === service.source)?.name ?? service.source
    );
  };

  const hasPrice = (
    service: StreamingServiceOption,
  ): service is StreamOnDemand => {
    if (service.type === "streaming") {
      return false;
    }

    const { rent, purchase } = service.prices;
    return Boolean(rent || purchase);
  };
</script>

<div class="trakt-streamin-service-category">
  <CollapsableValues category="streaming" values={services}>
    <p class="meta-info secondary">{title}</p>
    {#snippet value(service)}
      <Link href={service.link} target="_blank">
        <p class="small ellipsis">
          {getServiceName(service)}
          {#if hasPrice(service)}
            {`(${getMediaCost(service)})`}
          {/if}
        </p>
      </Link>
    {/snippet}
  </CollapsableValues>
</div>

<style>
  .trakt-streamin-service-category {
    :global(.trakt-link) {
      display: flex;
      align-items: center;

      overflow: hidden;

      gap: var(--gap-xs);
    }
  }
</style>
