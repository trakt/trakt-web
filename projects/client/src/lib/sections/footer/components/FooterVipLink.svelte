<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { useVipUpsell } from "$lib/features/upsell/useVipUpsell";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { trackClick, trackImpression } = useVipUpsell(() => "footer");
</script>

<div use:trackImpression>
  <Link href={UrlBuilder.vip("footer")} onclick={trackClick}>
    <span class="bold">VIP</span>
  </Link>
</div>
