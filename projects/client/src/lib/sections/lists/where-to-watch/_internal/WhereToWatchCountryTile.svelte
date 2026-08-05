<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import { getMediaCost } from "./getMediaCost";
  import type { WhereToWatchCountryTileProps } from "./models/WhereToWatchCountryTileProps";
  import { toCountryFlag } from "./toCountryFlag";

  const {
    service,
    country,
    countryName,
    type,
  }: WhereToWatchCountryTileProps = $props();

  const { track } = useTrack(AnalyticsEvent.StreamOn);

  const cost = $derived(
    service.type === "on-demand" ? getMediaCost(service, type) : "",
  );
</script>

<div class="trakt-where-to-watch-country-tile">
  <Link
    href={service.link}
    target="_blank"
    onclick={() => track({ source: service.source })}
  >
    <div class="country-tile-content">
      <span class="country-flag">{toCountryFlag(country)}</span>
      <span class="country-name ellipsis">
        {countryName ?? country.toUpperCase()}
      </span>
      {#if cost}
        <span class="country-cost tag secondary">{cost}</span>
      {/if}
    </div>
  </Link>
</div>

<style lang="scss">
  .trakt-where-to-watch-country-tile {
    min-width: 0;

    :global(.trakt-link) {
      display: block;
      text-decoration: none;
      color: var(--color-text-primary);

      &:hover {
        color: var(--color-text-primary);
      }
    }
  }

  .country-tile-content {
    display: flex;
    align-items: center;
    gap: var(--gap-s);

    min-width: 0;
    min-height: var(--ni-40);
    padding-block: var(--ni-8);
    padding-inline: var(--ni-12);
    box-sizing: border-box;

    background-color: color-mix(
      in srgb,
      var(--color-foreground) 8%,
      transparent
    );
    border-radius: var(--border-radius-m);
  }

  .country-flag {
    flex-shrink: 0;
    font-size: var(--ni-20);
    line-height: var(--ni-20);
  }

  .country-name {
    flex: 1;
    min-width: 0;
    text-align: start;
    color: var(--color-text-primary);
  }

  .country-cost {
    flex-shrink: 0;
  }
</style>
