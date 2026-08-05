<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import type { LibraryOption } from "../models/LibraryOption";
  import { getMediaCost } from "./getMediaCost";
  import WhereToWatchLogo from "./WhereToWatchLogo.svelte";
  import WhereToWatchServiceLink from "./WhereToWatchServiceLink.svelte";

  type WhereToWatchItemProps = {
    service: StreamingServiceOption | LibraryOption;
    country: string;
  };

  const { service, country }: WhereToWatchItemProps = $props();

  const text = $derived.by(() => {
    switch (service.type) {
      case "library":
        return m.text_library();
      case "streaming":
        return m.text_stream();
      case "on-demand": {
        const costText = getMediaCost(service, "any");
        if (!costText) {
          return m.text_on_demand();
        }

        const typeText = service.prices.rent ? m.text_rent() : m.text_buy();
        return `${typeText} (${costText})`;
      }
    }
  });

  const hasSmallLogo = $derived(service.type === "on-demand");
</script>

<div class="trakt-where-to-watch-item">
  <WhereToWatchServiceLink {service}>
    <div class="where-to-watch-item-content">
      <WhereToWatchLogo
        source={service.source}
        {country}
        size={hasSmallLogo ? "small" : "default"}
      />
      {#if text}
        <p>{text}</p>
      {/if}
    </div>
  </WhereToWatchServiceLink>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-where-to-watch-item {
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

    transition: background-color var(--transition-increment) ease-in-out;

    @include for-mouse {
      &:hover {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 8%,
          var(--color-card-background)
        );
      }
    }

    justify-content: center;
    overflow: hidden;

    p {
      text-align: center;
      flex-shrink: 0;
      flex-grow: 1;
      min-height: var(--ni-18);
      display: flex;
      align-items: center;
    }
  }
</style>
