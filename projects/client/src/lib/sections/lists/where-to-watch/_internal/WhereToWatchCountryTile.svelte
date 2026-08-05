<script lang="ts">
  import { getMediaCost } from "./getMediaCost";
  import type { WhereToWatchCountryTileProps } from "./models/WhereToWatchCountryTileProps";
  import { toCountryFlag } from "./toCountryFlag";
  import WhereToWatchServiceLink from "./WhereToWatchServiceLink.svelte";

  const { service, country, countryName, type }:
    WhereToWatchCountryTileProps = $props();

  const cost = $derived(getMediaCost(service, type));
</script>

<div class="trakt-where-to-watch-country-tile">
  <WhereToWatchServiceLink {service}>
    <div class="country-tile-content">
      <span class="country-flag">{toCountryFlag(country)}</span>
      <span class="country-name ellipsis">
        {countryName}
      </span>
      {#if cost}
        <span class="country-cost tag secondary">{cost}</span>
      {/if}
    </div>
  </WhereToWatchServiceLink>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

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

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 16%,
          transparent
        );
      }
    }
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
