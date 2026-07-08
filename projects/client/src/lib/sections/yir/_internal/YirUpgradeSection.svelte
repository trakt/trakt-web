<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { m } from "$lib/paraglide/messages";
  import YirPageInner from "./YirPageInner.svelte";

  const {
    slug,
    source = "yir",
  }: {
    /** Profile being viewed; the upsell only shows on your own page. */
    slug: string;
    /** Analytics source for the upsell CTA (e.g. "yir" or "mir"). */
    source?: string;
  } = $props();

  const { isMe } = $derived(useIsMe(slug));
</script>

<RenderFor audience="free">
  {#if $isMe}
    <section class="trakt-yir-upgrade-section">
      <YirPageInner>
        <div class="yir-upgrade-card">
          <div class="yir-upgrade-content">
            <h2 class="bold">
              {m.button_text_upgrade_to_vip()}
            </h2>
            <p class="yir-upgrade-message">{m.yir_upgrade_message()}</p>
            <div class="yir-upgrade-cta">
              <UpsellCta {source} variant="small">
                {m.link_label_get_vip()}
              </UpsellCta>
            </div>
          </div>
        </div>
      </YirPageInner>
    </section>
  {/if}
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-yir-upgrade-section {
    background-color: var(--color-yir-background);
    padding-block: var(--ni-40);

    // YirPageInner only adds a small side gutter on narrow screens, so top it
    // up here to keep the card off the edges (matches the 2024 sections).
    @include for-tablet-sm-and-below {
      padding-inline: var(--ni-24);
    }

    @include for-mobile {
      padding-inline: var(--ni-16);
    }
  }

  .yir-upgrade-card {
    position: relative;
    overflow: hidden;

    border-radius: var(--border-radius-xxl);
    border: var(--ni-1) solid
      color-mix(in srgb, var(--color-vip-border-accent) 60%, transparent);
    padding: var(--ni-52) var(--ni-32);

    // Fixed dark-maroon VIP treatment in both themes (matches the brand's VIP
    // surfaces): faint conic "sunburst" rays with a radial vignette so the
    // centered copy stays readable.
    color: var(--shade-10);
    background-color: var(--red-950);
    background-image:
      radial-gradient(
        circle at 50% 42%,
        transparent 0%,
        color-mix(in srgb, var(--shade-1000) 70%, transparent) 100%
      ),
      repeating-conic-gradient(
        from 0deg at 50% 42%,
        var(--red-950) 0deg 6deg,
        color-mix(in srgb, var(--red-800) 45%, var(--red-950)) 6deg 12deg
      );
    box-shadow: 0 0 var(--ni-52) var(--color-yir-upgrade-glow);

    @include for-mobile {
      border-radius: var(--border-radius-xl);
      padding: var(--ni-32) var(--ni-20);
    }
  }

  .yir-upgrade-content {
    position: relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-m);

    max-width: var(--ni-520);
    margin: 0 auto;
    text-align: center;
  }

  .yir-upgrade-message {
    line-height: 1.5;
    color: color-mix(in srgb, var(--shade-10) 85%, transparent);
  }

  .yir-upgrade-cta {
    margin-top: var(--gap-s);
    color: var(--color-text-primary);
  }
</style>
