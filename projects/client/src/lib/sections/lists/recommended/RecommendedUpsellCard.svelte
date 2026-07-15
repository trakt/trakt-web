<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Card from "$lib/components/card/Card.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const UPSELL_SOURCE = "recommended-list";

  const { track } = useTrack(AnalyticsEvent.VipUpsell);
</script>

<Card variant="transparent" --width-card="var(--width-portrait-card)">
  <div class="trakt-recommended-upsell-card">
    <p class="upsell-heading bold">
      {m.text_vip_upsell_smart_recommendations()}
    </p>

    <div class="upsell-action">
      <Button
        href={UrlBuilder.vip()}
        label={m.badge_text_get_vip()}
        variant="primary"
        style="flat"
        color="default"
        text="uppercase"
        onclick={() => track({ source: UPSELL_SOURCE })}
      >
        {m.badge_text_get_vip()}
      </Button>
    </div>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-recommended-upsell-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--gap-m);

    // Fill the Card's content box; the Card owns the card dimensions.
    width: 100%;
    height: 100%;
    box-sizing: border-box;

    padding: var(--ni-16);

    border-radius: var(--border-radius-m);
    box-shadow: var(--shadow-base);

    // Aspirational VIP gradient (purple -> blue -> warm) so the slot reads as
    // an invitation, not a paywall. Mirrors the primitive-driven approach used
    // by VipUpsellBadge. Deliberately uses the darker steps of each family
    // (same hues, ~L32-36) so white text on the light-glass CTA stays legible.
    background: linear-gradient(
      145deg,
      var(--purple-800) 0%,
      var(--blue-900) 45%,
      color-mix(in srgb, var(--purple-800) 65%, var(--red-800)) 100%
    );
    color: var(--shade-10);

    @include for-mobile {
      padding: var(--ni-12);
      gap: var(--gap-s);
    }
  }

  .upsell-heading {
    margin: 0;
    // Slightly larger than body copy so the pitch leads the card.
    font-size: var(--font-size-h6);
    line-height: 1.25;

    // Keep the message legible over the gradient's brighter mid-tones.
    text-shadow: 0 var(--ni-1) var(--ni-4)
      color-mix(in srgb, var(--shade-950) 45%, transparent);
  }

  .upsell-action {
    :global(.trakt-button) {
      width: 100%;

      // Outlined "stroked" CTA: transparent fill lets the darkened gradient
      // show through; the dark bg carries the white label's contrast on its own.
      background: transparent;
      color: var(--shade-10);

      border: var(--ni-1) solid
        color-mix(in srgb, var(--shade-10) 80%, transparent);

      transition:
        background var(--transition-increment) ease-in-out,
        border-color var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      :global(.trakt-button:hover),
      :global(.trakt-button:focus-visible) {
        background: color-mix(in srgb, var(--shade-10) 14%, transparent);
        border-color: var(--shade-10);
      }
    }
  }
</style>
