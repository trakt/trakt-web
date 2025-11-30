<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import type { LibraryOption } from "../models/LibraryOption";
  import { getMediaCost } from "./getMediaCost";

  const {
    service,
    country,
  }: { service: StreamingServiceOption | LibraryOption; country: string } =
    $props();

  const { track } = useTrack(AnalyticsEvent.StreamOn);

  const text = $derived.by(() => {
    switch (service.type) {
      case "library":
        return m.text_library();
      case "streaming":
        return m.text_stream();
      case "on-demand": {
        const costText = getMediaCost(service);
        if (!costText) {
          return m.text_on_demand();
        }

        const typeText = service.prices.rent ? m.text_rent() : m.text_buy();
        return `${typeText} (${costText})`;
      }
    }
  });
</script>

<div class="where-to-watch-item">
  <Link
    href={service.link}
    target="_blank"
    onclick={() => track({ source: service.source })}
  >
    <div class="where-to-watch-item-content">
      <StreamingServiceLogo
        source={service.source}
        {country}
        i18n={StreamingServiceLogoIntlProvider}
      />
      <p>{text}</p>
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
      flex-grow: 1;
      display: flex;
      align-items: center;
    }

    :global(.trakt-streaming-service-logo) {
      width: var(--ni-60);
      height: var(--ni-60);

      justify-content: center;
      text-align: center;

      color: var(--color-text-primary);

      :global(img),
      :global(svg) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      :global(img) {
        transition: filter var(--transition-increment) ease-in-out;
        filter: var(--streaming-service-logo-filter);
      }
    }

    :global(.trakt-streaming-service-logo.has-channel-logo) {
      flex-direction: column;

      :global(img) {
        height: 45%;
      }

      :global(img.trakt-channel-logo) {
        width: 75%;
        height: auto;
        max-height: 45%;

        transition: filter var(--transition-increment) ease-in-out;
        filter: var(--streaming-service-logo-filter);
      }

      :global(.trakt-channel-separator) {
        width: 50%;
        height: var(--ni-1);
      }
    }
  }
</style>
