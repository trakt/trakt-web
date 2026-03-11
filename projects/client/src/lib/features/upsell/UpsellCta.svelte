<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";

  const {
    source,
    children,
    title,
  }: { source: string; title?: string } & ChildrenProps = $props();
</script>

<div class="trakt-vip-upsell-cta">
  <div>
    <p class="bold">{title ?? m.text_vip_upsell_dive_deeper()}</p>
    <p class="tag secondary">{@render children()}</p>
  </div>
  <GetVIPLink {source} />
</div>

<style>
  .trakt-vip-upsell-cta {
    padding: var(--ni-12);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-border) 50%, transparent);
    border-radius: var(--border-radius-m);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-m);

    background-color: var(--color-card-background);
  }
</style>
