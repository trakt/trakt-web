<script lang="ts">
  import StreamingServiceLogo from "$lib/components/media/streaming-service/StreamingServiceLogo.svelte";
  import { StreamingServiceLogoIntlProvider } from "$lib/components/media/streaming-service/StreamingServiceLogoIntlProvider";

  const { source }: { source: string } = $props();
</script>

<span class="trakt-streaming-service-select-logo">
  <StreamingServiceLogo
    {source}
    i18n={StreamingServiceLogoIntlProvider}
  />
</span>

<style lang="scss">
  .trakt-streaming-service-select-logo {
    display: flex;
    align-items: center;
    justify-content: center;

    width: var(--ni-30);
    height: var(--ni-20);
    padding: var(--ni-2);
    box-sizing: border-box;
    flex-shrink: 0;

    border: var(--border-thickness-xxs) solid var(--shade-100);
    border-radius: var(--border-radius-s);
    background: color-mix(in srgb, var(--shade-900) 4%, transparent);

    :global(.trakt-streaming-service-logo) {
      width: 100%;
      height: 100%;

      justify-content: center;
      text-align: center;
      color: var(--shade-900);
    }

    :global(.trakt-streaming-service-logo img),
    :global(.trakt-streaming-service-logo svg) {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    :global(.trakt-streaming-service-logo img) {
      filter: brightness(0);
    }

    :global(.trakt-streaming-service-logo span) {
      font-size: var(--ni-8);
      line-height: 0.9;
      overflow: hidden;
      overflow-wrap: anywhere;
      hyphens: auto;
    }

    :global(.trakt-streaming-service-logo.has-logo span) {
      display: none;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo img.trakt-channel-logo) {
      display: none;
    }

    :global(.trakt-streaming-service-logo.has-channel-logo .trakt-channel-separator) {
      display: none;
    }
  }
</style>
