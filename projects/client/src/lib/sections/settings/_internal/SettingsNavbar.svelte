<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
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
  </div>
{/snippet}

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <div class="trakt-settings-navbar">
    <div class="trakt-settings-sidebar-content">
      {@render settingsLinks()}
    </div>
    <LogoutButton />
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    gap: var(--gap-s);

    min-height: var(--ni-480);
    max-height: calc(100dvh - var(--content-gap));

    :global(.trakt-button) {
      width: fit-content;
    }

    @include for-tablet-sm-and-below {
      min-height: 0;
      height: fit-content;
    }
  }

  .trakt-settings-sidebar-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
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
      text-decoration: none;
    }

    :global(.trakt-link.trakt-link-active) {
      :global(span.title) {
        color: var(--color-text-primary);
      }
    }

    @include for-tablet-sm-and-below {
      flex-direction: row;
      align-items: center;
    }
  }
</style>
