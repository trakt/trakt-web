<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

{#snippet settingsLinks()}
  <div class="trakt-settings-links">
    <Link href={UrlBuilder.settings.general()}>
      <span class="title">{m.link_text_general_settings()}</span>
    </Link>
    <Link href={UrlBuilder.settings.data()}>
      <span class="title">{m.link_text_data_settings()}</span>
    </Link>
    <RenderForFeature flag={FeatureFlag.StreamingServices}>
      {#snippet enabled()}
        <Link href={UrlBuilder.settings.streamingServices()}>
          <span class="title">{m.link_text_streaming_sync_settings()}</span>
        </Link>
      {/snippet}
    </RenderForFeature>
    <Link href={UrlBuilder.settings.advanced()}>
      <span class="title">{m.link_text_advanced_settings()}</span>
    </Link>
    <Link href={UrlBuilder.settings.preview()}>
      <span class="title">{m.link_text_preview_settings()}</span>
    </Link>
    <RenderForFeature flag={FeatureFlag.PlexSync}>
      {#snippet enabled()}
        <Link href={UrlBuilder.settings.plex()}>
          <span class="title">{m.link_text_plex_settings()}</span>
        </Link>
      {/snippet}
    </RenderForFeature>
  </div>
{/snippet}

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <div class="trakt-settings-navbar">
    {@render settingsLinks()}
  </div>
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
  <div class="trakt-settings-navbar">
    {@render settingsLinks()}
  </div>
</RenderFor>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-settings-navbar {
    position: sticky;
    top: calc(
      var(--navbar-actions-bottom, env(safe-area-inset-top, 0)) +
        var(--content-gap)
    );
    align-self: start;

    display: flex;
    flex-direction: column;

    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
      top: calc(env(safe-area-inset-top, 0) + var(--content-gap));

      position: static;

      min-height: 0;
      height: fit-content;
    }
  }

  .trakt-settings-links {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    span.title {
      color: var(--color-text-secondary);

      transition: color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link) {
      display: block;
      padding: var(--ni-10) var(--ni-12);

      border-radius: var(--border-radius-m);

      text-decoration: none;

      transition: background-color var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link.trakt-link-active) {
      background-color: var(--purple-500);

      :global(span.title) {
        color: var(--shade-10);
      }
    }

    @include for-tablet-sm-and-below {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;

      gap: var(--gap-xs);

      :global(.trakt-link) {
        padding: var(--ni-8) var(--ni-10);
      }
    }
  }
</style>
