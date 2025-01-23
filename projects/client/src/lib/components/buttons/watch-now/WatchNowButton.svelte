<script lang="ts">
  import type {
    WatchNowServices,
    WatchNowStreaming,
  } from "$lib/requests/models/WatchNowServices";
  import type { WatchNowButtonIntl } from "./WatchNowButtonIntl";
  import { WatchNowButtonIntlProvider } from "./WatchNowButtonIntlProvider";
  import WatchNowDropdown from "./_internal/WatchNowDropdown.svelte";
  import WatchNowLink from "./_internal/WatchNowLink.svelte";

  type WatchNowButtonProps = {
    isLoading: boolean;
    mediaTitle: string;
    preferred?: WatchNowStreaming;
    services?: WatchNowServices;
    i18n?: WatchNowButtonIntl;
  };

  const {
    isLoading,
    mediaTitle,
    services,
    preferred,
    i18n = WatchNowButtonIntlProvider,
  }: WatchNowButtonProps = $props();

  /**
   * TODO: @seferturan
   *
   * Let's replace this watch now button with actionable tags on the cover (eg: Netflix, Prime Video, etc.)
   * TV apps should go with actionable button, web and mobile should go with tags on the cover.
   */
</script>

{#if preferred}
  <WatchNowLink {mediaTitle} service={preferred} {i18n} {isLoading} />
{:else}
  <WatchNowDropdown {mediaTitle} {services} {i18n} {isLoading} />
{/if}
