<script lang="ts">
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import type { WatchNowServices } from "$lib/requests/models/WatchNowServices";
  import type { WatchNowButtonIntl } from "../WatchNowButtonIntl";
  import WatchNowDropdownItem from "./WatchNowDropdownItem.svelte";

  type WatchNowDropdownButtonProps = {
    mediaTitle: string;
    services?: WatchNowServices;
    i18n: WatchNowButtonIntl;
    isLoading: boolean;
  };

  const { mediaTitle, services, i18n, isLoading }: WatchNowDropdownButtonProps =
    $props();

  const streamingServices = $derived(services?.streaming ?? []);
  const onDemandServices = $derived(services?.onDemand ?? []);
  const allServices = $derived([...streamingServices, ...onDemandServices]);

  const isDisabled = $derived(isLoading || allServices.length === 0);
</script>

<DropdownList
  label={i18n.title(mediaTitle)}
  variant="primary"
  style="textured"
  color="purple"
  text="capitalize"
  size="normal"
  disabled={isDisabled || undefined}
>
  {i18n.watchOnMultiple({ count: allServices.length, isDisabled })}

  {#snippet items()}
    {#each allServices as service}
      <WatchNowDropdownItem {service} {i18n} />
    {/each}
  {/snippet}
</DropdownList>
