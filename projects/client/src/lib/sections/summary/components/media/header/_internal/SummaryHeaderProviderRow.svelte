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
    country,
  }: {
    service: StreamingServiceOption;
    country: string;
  } = $props();

  const logo = $derived(
    useStreamingServiceLogo({ source: service.source, country }),
  );
  const offer = $derived(toProviderOffer(service));

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
  .trakt-summary-header-provider-row {
    :global(a) {
      display: flex;
      align-items: center;
      gap: var(--gap-s);

      /*
        Fixed row height, not padding-derived: the rows share one height so the
        list reads as a list, not a stack of differently sized parts.
      */
      min-height: var(--provider-row-height, var(--ni-52));
      padding-block: var(--gap-xxs);
      box-sizing: border-box;

      text-decoration: none;
    }
  }

  /*
    A fixed-width column, start-aligned, so every provider name begins on the same
    vertical line.

    It has to be a hard `width`, not `min-width`: services vary a lot in what they
    render - a single wide lettermark, a mark plus a channel logo either side of a
    separator, or a plain text name when there is no artwork at all. Any of those
    will size the column differently if allowed to, and then the names no longer
    line up.

    So the column is fixed and the contents are bounded to fit inside it, rather
    than the contents deciding the column. Marks keep their own aspect ratio
    (`width: auto` + max bounds), so nothing is stretched or cropped.
  */
  .provider-logo {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex: none;

    /* Fixed on both axes, so every mark occupies an identical cell. */
    width: var(--provider-logo-column, var(--ni-36));
    height: var(--ni-24);

    :global(.trakt-streaming-service-logo) {
      width: 100%;
      height: 100%;
      justify-content: flex-start;
    }

    /*
      Two classes deep on purpose: StreamingServiceLogo pins its own images to a
      fixed width, and an equally specific selector here would depend on which
      component's styles happen to come out last.
    */
    :global(.trakt-streaming-service-logo img),
    :global(.trakt-streaming-service-logo svg) {
      width: auto;
      max-width: 100%;
      max-height: 100%;
    }

    /*
      Channel provenance - "Apple TV via Amazon" and the like - renders as a
      SECOND brand mark plus a separator. Two marks cannot fit this compact column:
      the group overflows and collides with the provider name beside it, and each
      row ends up a different width. The header shows the primary mark only; the
      full Where to Watch view keeps the channel detail.
    */
    :global(.trakt-channel-separator),
    :global(.trakt-channel-logo) {
      display: none;
    }

    /* The no-artwork text fallback must not widen the column either. */
    :global(.trakt-streaming-service-logo span) {
      font-size: var(--font-size-tag);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .provider-info {
    display: flex;
    flex-direction: column;
    gap: var(--ni-2);

    min-width: 0;
  }

  .provider-name {
    font-size: var(--font-size-text);
    font-weight: 600;
    color: var(--color-text-primary);
  }

  .provider-offer {
    font-size: var(--font-size-text-small);
    color: var(--color-text-secondary);
    white-space: nowrap;
  }
</style>
