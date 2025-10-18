<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";

  const { children }: ChildrenProps = $props();
</script>

<trakt-upsell-link>
  <Link href={UrlBuilder.vip()} label={m.link_label_get_vip()} color="inherit">
    <VipUpsellBadge />
    {@render children()}
  </Link>
</trakt-upsell-link>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  trakt-upsell-link {
    :global(.trakt-link) {
      text-decoration: none;

      display: flex;
      justify-content: flex-start;
      align-items: center;

      gap: var(--gap-xs);
      padding: var(--ni-8);
      padding-right: var(--ni-12);
      box-sizing: border-box;

      border-radius: var(--border-radius-xl);

      background-color: var(--color-background-stem-tag);
      color: var(--color-foreground-stem-tag);

      transition: padding calc(var(--transition-increment) * 2) ease-in-out;

      &:hover {
        text-decoration: underline;
      }

      @include for-tablet-sm {
        padding: 0;

        :global(span) {
          display: none;
        }
      }
    }
  }
</style>
