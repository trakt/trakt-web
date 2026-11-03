<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import { useStreamingServiceLogo } from "$lib/components/media/streaming-service/useStreamingServiceLogo";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent";
  import { useTrack } from "$lib/features/analytics/useTrack";
  import type { StreamingServiceOption } from "$lib/requests/models/StreamingServiceOptions";
  import { toProviderOffer } from "./toProviderOffer.ts";

  /*
    One provider in the header's vertical watch list.

    The vertical row is the point of the redesign: it has the width to hold a
    long service name *and* the full offer on one line ("Rent 3.99 · Buy 9.99"),
    neither of which survived the old horizontal grid. The name truncates; the
    offer never does.
  */
  const {
    service,
    planCount = 1,
    country,
  }: {
    service: StreamingServiceOption;
    /** Plans of this service folded into the row ("2 plans"). */
    planCount?: number;
    country: string;
  } = $props();

  const logo = $derived(
    useStreamingServiceLogo({ source: service.source, country }),
  );
  const offer = $derived(toProviderOffer(service, planCount));

  const { track } = useTrack(AnalyticsEvent.StreamOn);
</script>

<div class="trakt-summary-header-provider-row">
  <Link
    href={service.link}
    target="_blank"
    onclick={() => track({ source: service.source })}
  >
    <span class="provider-logo">
      <StreamingServiceLogo
        source={service.source}
        {country}
        i18n={StreamingServiceLogoIntlProvider}
      />
    </span>

    <span class="provider-info">
      <span class="provider-name ellipsis">{$logo?.name ?? service.source}</span>
      <span class="provider-offer">{offer}</span>
    </span>
  </Link>
</div>

<style lang="scss">
  /*
    The whole row is the link, with a soft wash on hover. Padding and a
    negative margin trade so the wash reaches past the tile without moving the
    row off the column's edge.
  */
  .trakt-summary-header-provider-row {
    :global(a) {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      /* Fixed, so the rows share the strip's one row height. */
      min-height: var(--summary-header-row-height, var(--ni-44));
      padding-inline: var(--ni-8);
      margin-inline: calc(-1 * var(--ni-8));
      box-sizing: border-box;

      border-radius: var(--border-radius-m);
      text-decoration: none;

      transition: background-color var(--transition-increment) ease-out;
    }

    @media (hover: hover) and (pointer: fine) {
      :global(a:hover) {
        background-color: color-mix(
          in srgb,
          var(--color-foreground) 5%,
          transparent
        );
      }
    }
  }

  /*
    Every mark sits on the same 44px tile, so Apple TV's wordmark, Prime
    Video's and a lettermark all read at one size, and the names beside them
    start on one line.

    Channel provenance - "Apple TV via Amazon" - renders as a second mark plus a
    separator; the tile shows the primary mark only, and the full Where to
    Watch view keeps the channel detail.
  */
  .provider-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    width: var(--summary-header-tile, var(--ni-44));
    height: var(--summary-header-tile, var(--ni-44));
    border-radius: var(--border-radius-m);

    background-color: var(--color-card-background);
    box-shadow: inset 0 0 0 var(--ni-1)
      color-mix(in srgb, var(--color-foreground) 10%, transparent);

    :global(.trakt-streaming-service-logo) {
      justify-content: center;
    }

    /*
      Two classes deep on purpose: StreamingServiceLogo pins its own images to a
      fixed width, and an equally specific selector here would depend on which
      component's styles happen to come out last.
    */
    :global(.trakt-streaming-service-logo img),
    :global(.trakt-streaming-service-logo svg) {
      width: auto;
      max-width: calc(var(--ni-44) - var(--ni-8));
      max-height: var(--ni-22);
      object-fit: contain;
    }

    :global(.trakt-channel-separator),
    :global(.trakt-channel-logo) {
      display: none;
    }

    /* The no-artwork text fallback must not widen the tile either. */
    :global(.trakt-streaming-service-logo span) {
      max-width: calc(var(--ni-44) - var(--ni-8));
      font-size: var(--font-size-tag);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .provider-info {
    display: flex;
    flex-direction: column;

    min-width: 0;
  }

  .provider-name {
    font-size: var(--font-size-text);
    font-weight: 700;
    line-height: var(--ni-20);
    color: var(--color-text-primary);
  }

  /* Two classes deep: Link pins the colour of spans inside it at (0,2,1). */
  .trakt-summary-header-provider-row .provider-offer {
    font-size: var(--font-size-text-small);
    line-height: var(--ni-16);
    color: var(--color-text-quiet);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
