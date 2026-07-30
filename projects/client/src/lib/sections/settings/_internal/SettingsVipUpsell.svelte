<script lang="ts">
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
  import type { SettingsVipUpsellProps } from "./SettingsVipUpsellProps.ts";

  const { icon, title, description, source }: SettingsVipUpsellProps = $props();
</script>

<div class="trakt-settings-vip-upsell">
  <span class="upsell-cue" aria-hidden="true">
    {@render icon()}
  </span>

  <div class="upsell-copy">
    <p class="trakt-card-title bold">{title}</p>
    <p class="tag secondary">{description}</p>
  </div>

  <div class="upsell-cta">
    <GetVIPLink {source} />
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-vip-upsell {
    display: flex;
    align-items: center;
    gap: var(--gap-m);

    padding: var(--gap-m);
    border-radius: var(--border-radius-l);

    background: var(--background-vip-elevated-card);
    border: var(--ni-1) solid var(--color-vip-border-accent);
    box-shadow: 0 var(--ni-2) var(--ni-16)
      color-mix(in srgb, var(--purple-500) 18%, transparent);

    @include for-mobile {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-s);
    }
  }

  .upsell-cue {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    padding: var(--ni-10) var(--ni-12);
    height: var(--ni-40);
    box-sizing: border-box;
    border-radius: var(--border-radius-m);

    color: var(--color-vip-border-accent);
    background: color-mix(in srgb, var(--purple-500) 14%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 32%, transparent);

    :global(svg) {
      width: auto;
      height: 100%;
    }
  }

  .upsell-copy {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);
    min-width: 0;
    flex: 1 1 auto;
  }

  .upsell-cta {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>
