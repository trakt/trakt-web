<script lang="ts">
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";

  const { source, country, dimmed = false, selected = false, ring = true }: {
    source: string;
    country?: string;
    dimmed?: boolean;
    selected?: boolean;
    ring?: boolean;
  } = $props();
</script>

<div
  class="trakt-service-logo-box"
  class:is-dimmed={dimmed}
  class:is-selected={selected}
  class:has-ring={ring}
>
  <StreamingServiceLogo
    {source}
    {country}
    i18n={StreamingServiceLogoIntlProvider}
  />
</div>

<style lang="scss">
  .trakt-service-logo-box {
    width: 100%;
    aspect-ratio: 1;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: var(--ni-8);
    box-sizing: border-box;

    border: var(--ni-1) solid var(--color-border);
    border-radius: var(--border-radius-m);

    transition: var(--transition-increment) ease-in-out;
    transition-property: filter, opacity, border-color, background;

    &.is-dimmed {
      filter: grayscale(1);
      opacity: 0.55;
    }

    &.is-selected {
      // Theme-aware neutral surface: very light gray in light mode, a subtle
      // raised surface in dark mode - so logos read in both themes.
      background: color-mix(in srgb, var(--color-foreground) 8%, transparent);
    }

    // The purple selection ring is only shown where selection is an
    // interaction (the drawer) - not on the main page's favorites display.
    &.is-selected.has-ring {
      border-color: var(--color-background-purple);
    }

    :global(.trakt-streaming-service-logo) {
      width: var(--ni-60);
      height: var(--ni-60);

      justify-content: center;
      text-align: center;
      color: var(--color-text-primary);
    }

    :global(.trakt-streaming-service-logo img),
    :global(.trakt-streaming-service-logo svg) {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    // Flip the monochrome catalog logos (remote PNGs) so they read on the
    // surface: black in light mode, white in dark. Colorized SVG logos keep
    // their own fills.
    :global(.trakt-streaming-service-logo img) {
      filter: var(--streaming-service-logo-filter);
    }

    // Text-only services (no logo): keep the name compact above the sub-brand.
    :global(.trakt-streaming-service-logo span) {
      font-size: var(--font-size-tag);
      line-height: 1.15;
      overflow: hidden;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo) {
      flex-direction: column;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo img) {
      height: 45%;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo img.trakt-channel-logo) {
      width: 75%;
      height: auto;
      max-height: 45%;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo .trakt-channel-separator) {
      width: 50%;
      height: var(--ni-1);
    }
  }
</style>
