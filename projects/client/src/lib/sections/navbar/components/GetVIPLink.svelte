<script lang="ts">
  import VipBadge from "$lib/components/badge/VipBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

<trakt-get-vip-link>
  <Link href={UrlBuilder.vip()} label={m.get_vip_label()} color="inherit">
    <RenderFor audience="authenticated" device={["desktop"]}>
      <p class="small bold uppercase">{m.get()}</p>
    </RenderFor>
    <VipBadge />
  </Link>
</trakt-get-vip-link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-get-vip-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      align-items: center;
      gap: var(--gap-xs);

      padding: var(--ni-4);
      border-radius: var(--border-radius-xxl);

      transition: background-color var(--transition-increment) ease-in-out;

      @include for-desktop {
        padding-left: var(--ni-16);
      }

      @include for-mouse {
        &:hover,
        &:focus-visible {
          background-color: var(--color-background);
          color: var(--color-foreground);
        }
      }
    }
  }
</style>
