<script lang="ts">
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages";
  import TicketPair from "$lib/features/promotions/TicketPair.svelte";
  import { toHumanOfferEnd } from "$lib/features/promotions/toHumanOfferEnd";
  import { toHumanOfferPrice } from "$lib/features/promotions/toHumanOfferPrice";
  import { toPromotionUpsellSource } from "$lib/features/upsell/toPromotionUpsellSource";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell";
  import type { PromotionOffer } from "$lib/requests/models/PromotionOffer";
  import { toHumanCurrency } from "$lib/utils/formatting/currency/toHumanCurrency";
  import { toHumanPlanTerm } from "$lib/utils/formatting/date/toHumanPlanTerm";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BannerCta from "../_internal/BannerCta.svelte";
  import DismissButton from "../_internal/DismissButton.svelte";

  const { onDismiss, offer }: { onDismiss: () => void; offer: PromotionOffer } =
    $props();

  const upsellSource = $derived(toPromotionUpsellSource(offer));
  const { trackClick, trackImpression } = useVipUpsell(() => upsellSource);
  const headline = $derived(
    m.text_promotion_offer_headline({
      term: toHumanPlanTerm({
        months: offer.plan.monthsInTerm,
        locale: languageTag(),
      }),
      price: toHumanOfferPrice({ offer, kind: "discounted" }),
    }),
  );
  const pitch = $derived(
    m.text_promotion_offer_pitch({
      monthly: toHumanCurrency({
        price:
          Math.round(
            (offer.plan.discountedPrice / offer.plan.monthsInTerm) * 100,
          ) / 100,
        currency: offer.plan.currency,
        locale: languageTag(),
      }),
    }),
  );
  const endsOn = $derived(
    toHumanOfferEnd({
      endsAt: offer.endsAt,
      now: new Date(),
      locale: languageTag(),
    }),
  );
</script>

<div class="trakt-tickets-banner">
  <div class="tickets-dismiss">
    <DismissButton {onDismiss} />
  </div>

  <div class="tickets-copy">
    <div class="tickets-eyebrow">
      <span class="tickets-name">{offer.name}</span>
      <span class="tickets-ends">{endsOn}</span>
    </div>

    <p class="tickets-headline">{headline}</p>

    <p class="tickets-pitch">{pitch}</p>
  </div>

  <div class="tickets-art">
    <TicketPair label={offer.label} />
  </div>

  <div class="tickets-offer" use:trackImpression>
    <BannerCta
      href={UrlBuilder.vip(upsellSource, offer.plan.duration)}
      label={m.button_text_promotion_claim()}
      onclick={trackClick}
    >
      {m.button_text_promotion_claim()}
    </BannerCta>
  </div>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-tickets-banner {
    position: relative;
    overflow: hidden;
    z-index: var(--layer-base);

    display: flex;
    align-items: center;
    gap: var(--gap-l);

    padding: var(--ni-24) var(--ni-56) var(--ni-24) var(--ni-32);
    box-sizing: border-box;

    border-radius: var(--border-radius-xl);
    --color-foreground: var(--shade-10);
    --color-text-primary: var(--shade-10);
    color: var(--shade-10);
    background: linear-gradient(
      100deg,
      var(--shade-940) 40%,
      var(--purple-900) 72%,
      var(--purple-700) 100%
    );
    box-shadow: var(--shadow-floating);

    @include for-tablet-lg {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      grid-template-areas:
        "copy art"
        "copy offer";
      column-gap: var(--gap-l);
      row-gap: var(--gap-m);
      padding-inline-end: var(--ni-48);
    }

    @include for-tablet-sm-and-below {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--gap-m);

      padding: var(--ni-20) var(--ni-48) var(--ni-20) var(--ni-20);

      background: linear-gradient(
        160deg,
        var(--shade-940) 45%,
        var(--purple-900) 80%,
        var(--purple-700) 110%
      );
    }
  }

  .tickets-copy {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);

    flex: 1;
    min-width: 0;

    @include for-tablet-lg {
      grid-area: copy;
    }
  }

  .tickets-eyebrow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--gap-s);

    margin-block-end: var(--gap-s);
  }

  .tickets-name {
    padding: var(--ni-2) var(--ni-10);

    border-radius: var(--border-radius-xs);
    background: var(--shade-10);
    color: var(--shade-1000);

    font-size: var(--font-size-text-small);
    font-weight: 900;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tickets-ends {
    color: var(--purple-200);

    font-size: var(--font-size-text-small);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .tickets-headline {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--gap-s);
    margin: 0;

    font-size: calc(var(--font-size-title) * 1.4);
    font-weight: 800;
    line-height: 1.1;
  }

  .tickets-pitch {
    margin: 0;
    color: color-mix(in srgb, var(--shade-10) 72%, transparent);
  }

  .tickets-art {
    --ticket-pair-size: var(--ni-12);

    flex-shrink: 0;
    align-self: center;
    margin-inline-end: var(--ni-44);

    @include for-tablet-lg {
      --ticket-pair-size: var(--ni-10);

      grid-area: art;
      justify-self: center;
      align-self: end;
      margin-inline-end: 0;
    }

    @include for-tablet-sm-and-below {
      position: absolute;
      inset-block-start: var(--ni-48);
      inset-inline-end: var(--ni-neg-24);

      z-index: var(--layer-background);
      opacity: 0.45;
    }
  }

  .tickets-offer {
    display: flex;
    align-items: center;
    gap: var(--gap-m);
    flex-shrink: 0;

    @include for-tablet-lg {
      grid-area: offer;
      justify-self: center;
      align-self: start;
    }
  }

  .tickets-offer :global(.trakt-banner-cta .trakt-button) {
    background-color: var(--shade-1000);
  }

  .tickets-dismiss {
    position: absolute;
    z-index: 1;

    top: var(--ni-8);
    inset-inline-end: var(--ni-8);
  }
</style>
