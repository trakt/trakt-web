<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import GetVIPLink from "$lib/sections/navbar/components/GetVIPLink.svelte";
</script>

<RenderFor audience="free">
  <section class="trakt-welcome-vip-upsell">
    <div class="upsell-copy">
      <p class="trakt-card-title bold">{m.welcome_vip_upsell_heading()}</p>
      <p class="tag secondary">
        {m.welcome_vip_upsell_description()}
      </p>
    </div>

    <div class="upsell-cta">
      <GetVIPLink source="welcome" />
    </div>
  </section>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-welcome-vip-upsell {
    display: flex;
    align-items: center;
    gap: var(--gap-l);

    width: 100%;
    box-sizing: border-box;

    padding: var(--gap-m);
    border-radius: calc(0.8 * var(--border-radius-m));

    background: color-mix(in srgb, var(--purple-500) 14%, transparent);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--purple-500) 45%, transparent);

    @include for-mobile {
      gap: var(--gap-s);
    }
  }

  .upsell-copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ni-2);
    min-width: 0;

    flex: 1 1 auto;

    text-align: start;
  }

  .upsell-cta {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
</style>
