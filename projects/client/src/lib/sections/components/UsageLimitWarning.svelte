<script lang="ts">
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import type { VipUpsellSource } from "$lib/features/upsell/models/VipUpsellSource";
  import RenderFor from "$lib/guards/RenderFor.svelte";

  type UsageLimitWarningProps = {
    warningClass: string;
    source: VipUpsellSource;
    upsellTitle?: string;
    upsellMessage: string;
    vipMessage: string;
  };

  const {
    warningClass,
    source,
    upsellTitle,
    upsellMessage,
    vipMessage,
  }: UsageLimitWarningProps = $props();
</script>

<RenderFor audience="free">
  <UpsellCta {source} title={upsellTitle}>
    {upsellMessage}
  </UpsellCta>
</RenderFor>

<RenderFor audience="vip">
  <div class="trakt-usage-limit-warning {warningClass}">
    <span>⚠️</span>
    <p>{vipMessage}</p>
  </div>
</RenderFor>

<style>
  div {
    padding: var(--ni-12);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-m);

    display: flex;
    align-items: center;
    gap: var(--gap-xs);

    background-color: var(--color-card-background);
  }
</style>
