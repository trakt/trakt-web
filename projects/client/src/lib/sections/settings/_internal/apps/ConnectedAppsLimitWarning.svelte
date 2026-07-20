<script lang="ts">
  import * as m from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
</script>

<RenderFor audience="free">
  <UpsellCta source="connected-apps">
    {m.warning_connected_apps_limit()}
  </UpsellCta>
</RenderFor>

<RenderFor audience="vip">
  <div class="trakt-connected-apps-limit-warning">
    <span>⚠️</span>
    <p>{m.warning_connected_apps_limit_vip()}</p>
  </div>
</RenderFor>

<style>
  .trakt-connected-apps-limit-warning {
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
