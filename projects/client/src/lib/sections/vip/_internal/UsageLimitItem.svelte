<script lang="ts">
  import LoadingIndicator from "$lib/components/icons/LoadingIndicator.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber";
  import UsageBar from "./UsageBar.svelte";
  import type { UsageCategoryItem } from "./utils/mapToUsageCategories";

  const {
    item,
    variant = "vip",
    isLoading = false,
  }: {
    item: UsageCategoryItem;
    variant?: "vip" | "free";
    isLoading?: boolean;
  } = $props();

  const limit = $derived(
    variant === "vip" ? item.limits.vip : item.limits.free,
  );
</script>

<div class="trakt-limit-item">
  <div class="trakt-limit-header">
    <span>{item.title()}</span>
    <div class="trakt-limit-values">
      {#if isLoading}
        <LoadingIndicator />
      {:else}
        <span>
          {toHumanNumber(item.limits.current, languageTag())}
        </span>
        <span class="secondary">/</span>
        <span class="secondary">
          {toHumanNumber(limit, languageTag())}
        </span>
      {/if}
    </div>
  </div>

  <UsageBar
    current={item.limits.current}
    freeLimit={item.limits.free}
    vipLimit={item.limits.vip}
    {variant}
    {isLoading}
  />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-limit-item {
    display: grid;
    grid-template-columns: var(--ni-220) 1fr;
    column-gap: var(--gap-s);
    align-items: center;
    align-content: center;

    height: var(--ni-18);

    @include for-tablet-sm-and-below {
      height: auto;
      grid-template-columns: 1fr;
      row-gap: var(--gap-xxs);
    }
  }

  .trakt-limit-header {
    display: grid;
    grid-template-columns: auto auto;
    column-gap: var(--gap-s);
    align-items: center;

    @include for-tablet-sm-and-below {
      grid-template-columns: 1fr auto;
    }
  }

  .trakt-limit-values {
    display: flex;
    align-items: center;
    gap: var(--gap-micro);
    justify-content: flex-end;

    :global(.loading-indicator svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }
</style>
