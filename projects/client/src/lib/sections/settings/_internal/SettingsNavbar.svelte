<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
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
    <Link href={UrlBuilder.settings.advanced()}>
      <span class="title">{m.link_text_advanced_settings()}</span>
    </Link>
    <Link href={UrlBuilder.settings.preview()}>
      <span class="title">{m.link_text_preview_settings()}</span>
    </Link>
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
    top: calc(env(safe-area-inset-top, 0) + var(--content-gap));
    align-self: start;

    display: flex;
    flex-direction: column;

    gap: var(--gap-s);

    @include for-tablet-sm-and-below {
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
      background-color: color-mix(
        in srgb,
        var(--color-link-active) 14%,
        transparent
      );

      :global(span.title) {
        color: var(--color-link-active);
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
