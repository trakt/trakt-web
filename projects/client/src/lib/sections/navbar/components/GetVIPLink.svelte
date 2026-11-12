<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { toHumanOfferPrice } from "$lib/features/promotions/toHumanOfferPrice";
  import { useActiveOffer } from "$lib/features/promotions/useActiveOffer";
  import { toPromotionUpsellSource } from "$lib/features/upsell/toPromotionUpsellSource";
  import type { VipUpsellSource } from "$lib/features/upsell/models/VipUpsellSource";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import OfferChip from "./_internal/OfferChip.svelte";

  const { source }: { source: VipUpsellSource } = $props();

  const { offer } = useActiveOffer();

  const upsellSource = $derived(
    $offer ? toPromotionUpsellSource($offer) : source,
  );
  const label = $derived(
    $offer
      ? m.link_label_promotion_vip({
          name: $offer.name,
          price: toHumanOfferPrice({ offer: $offer, kind: "discounted" }),
        })
      : m.link_label_get_vip(),
  );

  const { trackClick, trackImpression } = useVipUpsell(() => upsellSource);
</script>

<trakt-get-vip-link use:trackImpression>
  <Link
    href={UrlBuilder.vip(upsellSource, $offer?.plan.duration)}
    {label}
    color="inherit"
    onclick={trackClick}
  >
    {#if $offer}
      <OfferChip offer={$offer} />
    {:else}
      <VipUpsellBadge />
    {/if}
  </Link>
</trakt-get-vip-link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-get-vip-link {
    display: inline-flex;

    :global(.trakt-link) {
      text-decoration: none;
      border-radius: var(--border-radius-pill);

      transition: transform var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link:active) {
      transform: scale(0.98);
    }
  }
</style>
