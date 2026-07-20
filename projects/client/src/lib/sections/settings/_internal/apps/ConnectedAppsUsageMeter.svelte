<script lang="ts">
  import DistributionBar from "$lib/components/charts/DistributionBar.svelte";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanNumber } from "$lib/utils/formatting/number/toHumanNumber.ts";

  const { current, limit }: { current: number; limit: number } = $props();

  const isAtLimit = $derived(current >= limit);
  const fraction = $derived(limit > 0 ? current / limit : 0);
</script>

<div class="trakt-connected-apps-usage-meter" class:has-alert={isAtLimit}>
  <div class="meter-bar">
    <DistributionBar
      {fraction}
      color={isAtLimit ? "var(--red-500)" : undefined}
      --distribution-bar-thickness="var(--ni-6)"
    />
  </div>

  <span class="meter-count tag">
    {toHumanNumber(current, languageTag())}/{toHumanNumber(
      limit,
      languageTag(),
    )}
  </span>
</div>

<style lang="scss">
  .trakt-connected-apps-usage-meter {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    &.has-alert .meter-count {
      color: var(--red-500);
    }
  }

  .meter-bar {
    width: var(--ni-64);
    flex-shrink: 0;
  }

  .meter-count {
    white-space: nowrap;
  }
</style>
