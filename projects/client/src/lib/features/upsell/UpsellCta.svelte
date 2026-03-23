<script lang="ts">
  import VipUpsellBadge from "$lib/components/badge/VipUpsellBadge.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { AnalyticsEvent } from "../analytics/events/AnalyticsEvent";
  import { useTrack } from "../analytics/useTrack";

  const {
    source,
    children,
    title,
    variant = "default",
  }: {
    source: string;
    title?: string;
    variant?: "default" | "small";
  } & ChildrenProps = $props();

  const { track } = useTrack(AnalyticsEvent.VipUpsell);
</script>

<div class="trakt-vip-upsell-cta" data-variant={variant}>
  <Link
    href={UrlBuilder.vip()}
    label={m.link_label_get_vip()}
    color="inherit"
    onclick={() => track({ source })}
  >
    <div>
      {#if variant === "default"}
        <p class="bold">{title ?? m.text_vip_upsell_dive_deeper()}</p>
      {/if}

      <p class="tag secondary capitalize">{@render children()}</p>
    </div>
    <VipUpsellBadge />
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-vip-upsell-cta {
    &[data-variant="small"] {
      :global(.trakt-link) {
        gap: var(--gap-xs);

        padding: var(--ni-8) var(--ni-12);
        height: var(--ni-44);

        box-sizing: border-box;
      }
    }

    :global(.trakt-link) {
      padding: var(--ni-12);
      border: var(--ni-1) solid
        color-mix(in srgb, var(--color-border) 50%, transparent);
      border-radius: var(--border-radius-m);

      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-m);

      background-color: var(--color-card-background);

      text-decoration: none;

      transition: border-color var(--transition-increment) ease-in-out;
    }

    @include for-mouse {
      &:hover,
      &:focus-visible {
        :global(.trakt-link) {
          border-color: color-mix(in srgb, var(--purple-500) 50%, transparent);
        }
      }
    }
  }
</style>
