<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import type { LibraryOption } from "../models/LibraryOption";
  import { getMediaCost, type CostType } from "./getMediaCost";
  import { toCountryFlag } from "./toCountryFlag";
  import WhereToWatchLogo from "./WhereToWatchLogo.svelte";

  type WhereToWatchItemProps = {
    service: StreamingServiceOption | LibraryOption;
    country: string;
    variant?: "service" | "country";
    type?: CostType;
    countryName?: string;
  };

  const {
    service,
    country,
    variant = "service",
    type = "any",
    countryName,
  }: WhereToWatchItemProps = $props();

  const { track } = useTrack(AnalyticsEvent.StreamOn);

  const text = $derived.by(() => {
    if (variant === "country") {
      if (service.type !== "on-demand") {
        return;
      }

      const costText = getMediaCost(service, type);
      if (!costText) {
        return;
      }

      return costText;
    }

    switch (service.type) {
      case "library":
        return m.text_library();
      case "streaming":
        return m.text_stream();
      case "on-demand": {
        const costText = getMediaCost(service, type);
        if (!costText) {
          return m.text_on_demand();
        }

        const typeText = service.prices.rent ? m.text_rent() : m.text_buy();
        return `${typeText} (${costText})`;
      }
    }
  });

  const hasSmallLogo = $derived(
    service.type === "on-demand" && variant === "service",
  );
  const nameLines = $derived(text ? 1 : 2);
</script>

<div class="where-to-watch-item">
  <Link
    href={service.link}
    target="_blank"
    onclick={() => track({ source: service.source })}
  >
    <div class="where-to-watch-item-content" data-variant={variant}>
      {#if variant === "country"}
        <div class="trakt-country">
          <span class="trakt-country-flag">{toCountryFlag(country)}</span>
          <span class="trakt-country-name" use:lineClamp={{ lines: nameLines }}>
            {countryName ?? country.toUpperCase()}
          </span>
        </div>
      {:else}
        <WhereToWatchLogo
          source={service.source}
          {country}
          size={hasSmallLogo ? "small" : "default"}
        />
      {/if}
      {#if text}
        <p>{text}</p>
      {/if}
    </div>
  </Link>
</div>

<style>
  .where-to-watch-item {
    :global(.trakt-link) {
      text-decoration: none;
      color: var(--color-text-secondary);

      &:hover {
        color: var(--color-text-secondary);
      }
    }
  }

  .where-to-watch-item-content {
    flex-shrink: 0;

    box-shadow: var(--shadow-base);

    width: var(--width-where-to-watch-item);
    height: var(--height-where-to-watch-item);

    padding: var(--ni-8);
    box-sizing: border-box;

    display: flex;
    flex-direction: column;
    align-items: center;

    background-color: var(--color-card-background);
    border-radius: var(--border-radius-m);

    p {
      text-align: center;
      flex-shrink: 0;
      min-height: var(--ni-18);
      display: flex;
      align-items: center;
    }

    &[data-variant="country"] {
      justify-content: center;
    }

    &[data-variant="service"] {
      justify-content: center;
      overflow: hidden;

      p {
        flex-grow: 1;
      }
    }
  }

  .trakt-country {
    display: grid;
    grid-template-rows: 1fr auto;
    justify-items: center;
    flex-grow: 1;
    gap: var(--gap-micro);

    .trakt-country-name {
      text-align: center;
      min-height: calc(2lh);
    }

    .trakt-country-flag {
      align-self: center;
      font-size: var(--ni-32);
      line-height: var(--ni-24);
    }
  }
</style>
