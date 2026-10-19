<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { VipUpsellSource } from "$lib/features/upsell/models/VipUpsellSource";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { source }: { source: VipUpsellSource } = $props();

  const { trackClick, trackImpression } = useVipUpsell(() => source);
</script>

<trakt-get-vip-link use:trackImpression>
  <Link
    href={UrlBuilder.vip(source)}
    label={m.link_label_get_vip()}
    color="inherit"
    onclick={trackClick}
  >
    <VipUpsellBadge />
  </Link>
</trakt-get-vip-link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-get-vip-link {
    :global(.trakt-link) {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
