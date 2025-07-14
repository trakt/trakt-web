<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<!-- FIXME: merge with GetVIPLink after removing the Lite switch -->
<trakt-get-vip-link>
  <Link href={UrlBuilder.vip()} label={m.link_label_get_vip()} color="inherit">
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
