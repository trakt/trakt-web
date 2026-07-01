<script lang="ts">
  import { isWellKnownSource } from "$lib/components/media/streaming-service/isWellKnownSource";
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";
  import * as m from "$lib/features/i18n/messages.ts";
  import { toWatchNowSource } from "./toWatchNowSource.ts";

  type StreamingServiceBadgeProps = {
    name: string;
    source?: string | null;
    logoUrl?: string | null;
    size?: "small" | "normal";
  };

  const {
    name,
    source,
    logoUrl,
    size = "normal",
  }: StreamingServiceBadgeProps = $props();

  // Reuse the project's built-in (local) colorized logos by mapping the
  // younify connection id onto its watch-now source slug. When no local logo
  // exists for the service, fall back to the younify API logo below.
  const watchNowSource = $derived(
    source ? toWatchNowSource(source) : undefined,
  );
</script>

<div class="trakt-streaming-service-badge" data-size={size}>
  {#if watchNowSource && isWellKnownSource(watchNowSource)}
    <StreamingServiceLogo
      source={watchNowSource}
      i18n={StreamingServiceLogoIntlProvider}
    />
  {:else if logoUrl}
    <img
      class="streaming-service-logo"
      src={logoUrl}
      alt={m.text_streaming_service_logo_alt({ service: name })}
      loading="lazy"
    />
  {:else}
    <span class="bold uppercase">{name}</span>
  {/if}
</div>

<style lang="scss">
  .trakt-streaming-service-badge {
    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-120);
    aspect-ratio: 16 / 10;
    padding: var(--ni-20);
    box-sizing: border-box;

    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--border-radius-m);
    // Theme-aware neutral surface: very light gray in light mode, a subtle
    // raised surface in dark mode - so logos read in both themes.
    background: var(
      --badge-background,
      color-mix(in srgb, var(--color-foreground) 8%, transparent)
    );

    overflow: hidden;

    &[data-size="small"] {
      // Matches the width of a single favorites tile (--ni-96).
      width: var(--ni-96);
      padding: var(--ni-12);
    }

    span {
      font-size: var(--font-size-tag);
      text-align: center;
      color: var(--color-text-primary);
    }

    :global(.trakt-streaming-service-logo) {
      width: 100%;
      height: 100%;

      justify-content: center;
    }

    :global(.trakt-streaming-service-logo img),
    :global(.trakt-streaming-service-logo svg) {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }

    // Flip the monochrome catalog logos (remote PNGs) so they read on the
    // surface: black in light mode, white in dark. Colorized SVG logos keep
    // their own fills.
    :global(.trakt-streaming-service-logo img) {
      filter: var(--streaming-service-logo-filter);
    }

    :global(.trakt-streaming-service-logo span) {
      font-size: var(--font-size-tag);
      color: var(--color-text-primary);
    }
  }

  .streaming-service-logo {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;

    filter: var(--streaming-service-logo-filter);
  }
</style>
