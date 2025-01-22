<script lang="ts">
  import type {
    WatchNowServices,
    WatchNowStreaming,
  } from "$lib/requests/models/WatchNowServices";
  import type { WatchNowButtonIntl } from "./WatchNowButtonIntl";
  import { WatchNowButtonIntlProvider } from "./WatchNowButtonIntlProvider";
  import WatchNowDirectLinkButton from "./_internal/WatchNowDirectLinkButton.svelte";
  import WatchNowDropdownButton from "./_internal/WatchNowDropdownButton.svelte";

  type WatchNowButtonProps = {
    isLoading: boolean;
    mediaTitle: string;
    favoriteService?: WatchNowStreaming;
    services?: WatchNowServices;
    i18n?: WatchNowButtonIntl;
  };

  const {
    isLoading,
    mediaTitle,
    services,
    favoriteService,
    i18n = WatchNowButtonIntlProvider,
  }: WatchNowButtonProps = $props();

  /**
   * TODO: @seferturan
   *
   * Let's replace this watch now button with actionable tags on the cover (eg: Netflix, Prime Video, etc.)
   * TV apps should go with actionable button, web and mobile should go with tags on the cover.
   */
</script>

{#if favoriteService}
  <WatchNowDirectLinkButton {mediaTitle} {favoriteService} {i18n} {isLoading} />
{:else}
  <WatchNowDropdownButton {mediaTitle} {services} {i18n} {isLoading} />
{/if}
