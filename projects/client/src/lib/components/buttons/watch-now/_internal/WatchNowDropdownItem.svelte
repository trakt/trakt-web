<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import type {
    WatchNowOnDemand,
    WatchNowStreaming,
  } from "$lib/requests/models/WatchNowServices";
  import { useWatchNowSources } from "$lib/stores/useWatchNowSources";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";
  import { getMediaCost } from "./getMediaCost";
  import WatchNowServiceLogo from "./WatchNowServiceLogo.svelte";

  type WatchNowDropdownItemProps = {
    service: WatchNowStreaming | WatchNowOnDemand;
    i18n: WatchNowButtonIntl;
  };

  const { service, i18n }: WatchNowDropdownItemProps = $props();

  const { sources } = useWatchNowSources();
  const serviceName = $sources.find(
    (source) => source.source === service.source,
  )?.name;
</script>

<DropdownItem href={service.link} target="_blank">
  {serviceName ?? service.source}

  {#if service.type === "on-demand"}
    {getMediaCost(service)}
  {/if}

  {#snippet icon()}
    <WatchNowServiceLogo source={service.source} style={"black"} {i18n} />
  {/snippet}
</DropdownItem>
