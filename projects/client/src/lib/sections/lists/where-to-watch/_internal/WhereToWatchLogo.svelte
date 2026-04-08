<script lang="ts">
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";

  type WhereToWatchLogoProps = {
    source: string;
    country?: string;
    size?: "small" | "default";
  };

  const { source, country, size = "default" }: WhereToWatchLogoProps = $props();
</script>

<div class="trakt-where-to-watch-logo" data-size={size}>
  <StreamingServiceLogo
    {source}
    {country}
    i18n={StreamingServiceLogoIntlProvider}
  />
</div>

<style>
  .trakt-where-to-watch-logo {
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

  .trakt-where-to-watch-logo[data-size="small"] {
    :global(.trakt-streaming-service-logo) {
      width: var(--ni-48);
      height: var(--ni-48);
    }
  }
</style>
