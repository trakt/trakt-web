<script lang="ts">
  import MessageWithBold from "$lib/components/text/MessageWithBold.svelte";
  import { languageTag } from "$lib/features/i18n/index.ts";
  import * as m from "$lib/features/i18n/messages";
  import { toHumanOfferPrice } from "$lib/features/promotions/toHumanOfferPrice";
  import type { PromotionOffer } from "$lib/requests/models/PromotionOffer";
  import { toHumanPlanTerm } from "$lib/utils/formatting/date/toHumanPlanTerm";

  const { offer }: { offer: PromotionOffer } = $props();

  const term = $derived(
    toHumanPlanTerm({ months: offer.plan.monthsInTerm, locale: languageTag() }),
  );
  const price = $derived(toHumanOfferPrice({ offer, kind: "discounted" }));
</script>

<trakt-offer-chip class="trakt-offer-chip">
  <span class="chip-tag"><span class="chip-tag-text">{offer.name}</span></span>
  <span class="chip-lines">
    <span
      ><MessageWithBold message={m.text_promotion_chip_term({ term })} /></span
    >
    <span
      ><MessageWithBold
        message={m.text_promotion_chip_price({ price })}
      /></span
    >
  </span>
</trakt-offer-chip>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-offer-chip {
    --chip-inset: var(--ni-4);

    display: inline-flex;
    align-items: stretch;
    gap: var(--gap-xs);

    height: var(--ni-36);
    padding-block: var(--chip-inset);
    padding-inline: var(--chip-inset) var(--ni-14);
    box-sizing: border-box;

    border-radius: var(--border-radius-pill);
    background: linear-gradient(135deg, var(--purple-600), var(--purple-400));
    color: var(--shade-10);

    @media (prefers-reduced-motion: no-preference) {
      animation: offer-chip-glow 2.8s ease-in-out infinite;
    }

    @include for-tablet-lg-and-below {
      padding-inline-start: var(--ni-14);
    }

    .chip-tag {
      display: flex;
      align-items: center;
      width: min-content;
      padding-inline: var(--ni-10);

      border-radius: var(--border-radius-pill);
      background: var(--shade-940);

      font-size: var(--font-size-tag);
      font-weight: 800;
      letter-spacing: 0.12em;
      line-height: 1.05;
      text-transform: uppercase;
      text-align: center;
      white-space: normal;

      @include for-tablet-lg-and-below {
        display: none;
      }

      .chip-tag-text {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        line-clamp: 2;
        -webkit-line-clamp: 2;
        overflow: hidden;

        font-size: inherit;
        font-weight: inherit;
      }
    }

    .chip-lines {
      display: flex;
      flex-direction: column;
      justify-content: center;

      line-height: 1.1;
      white-space: nowrap;

      > span {
        font-size: calc(var(--font-size-tag) * 1.15);
        font-weight: 400;
      }

      :global(b) {
        font-weight: 800;
      }
    }
  }

  @keyframes offer-chip-glow {
    0%,
    100% {
      box-shadow: 0 0 0 0 transparent;
    }

    50% {
      box-shadow: 0 0 var(--ni-16) var(--ni-2)
        color-mix(in srgb, var(--purple-500) 70%, transparent);
    }
  }
</style>
