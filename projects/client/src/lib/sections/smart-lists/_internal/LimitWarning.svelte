<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
</script>

<RenderFor audience="free">
  <UpsellCta source="smart-list" title={m.text_vip_upsell_more_lists()}>
    {m.text_vip_upsell_smart_lists()}
  </UpsellCta>
</RenderFor>

<RenderFor audience="vip">
  <div class="trakt-smart-lists-limit">
    <span>⚠️</span>
    <p>{m.warning_smart_lists_limit()}</p>
  </div>
</RenderFor>

<style>
  .trakt-smart-lists-limit {
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
