<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import Redirect from "$lib/components/router/Redirect.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import VipCancelFlow from "./_internal/cancel/components/VipCancelFlow.svelte";
  import { useVipCancelSummary } from "./_internal/cancel/useVipCancelSummary.ts";
  import VipContent from "./_internal/VipContent.svelte";

  const { state } = useVipCancelSummary();
</script>

<VipContent>
  <div class="trakt-vip-cancel">
    {#if $state.kind === "ready"}
      <VipCancelFlow summary={$state.summary} />
    {:else if $state.kind === "ineligible"}
      <Redirect to={UrlBuilder.vip()} />
    {:else}
      <div class="vip-cancel-loading">
        <LoadingIndicator />
      </div>
    {/if}
  </div>
</VipContent>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .vip-cancel-loading {
    display: grid;
    place-items: center;
  }

  .trakt-vip-cancel {
    display: grid;
    align-content: center;
    gap: var(--ni-40);
    width: 100%;
    min-height: calc(100dvh - var(--ni-16) - 2 * var(--ni-64));

    @include for-tablet-sm-and-below {
      align-content: start;
      min-height: auto;
      gap: var(--ni-24);
      padding-block-end: var(--mobile-navbar-height);
    }
  }
</style>
