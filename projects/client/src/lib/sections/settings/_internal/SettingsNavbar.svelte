<script lang="ts">
  import LogoutButton from "$lib/components/buttons/logout/LogoutButton.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
</script>

{#snippet settingsLinks()}
  <div class="trakt-settings-links">
    <Link href={UrlBuilder.settings.general()}>
      <h5 class="uppercase">{m.link_text_general_settings()}</h5>
    </Link>
    <Link href={UrlBuilder.settings.advanced()}>
      <h5 class="uppercase">{m.link_text_advanced_settings()}</h5>
    </Link>
  </div>
{/snippet}

<RenderFor audience="authenticated" device={["tablet-lg", "desktop"]}>
  <div class="trakt-settings-navbar">
    <div class="trakt-settings-sidebar-content">
      <h4>{m.header_settings()}</h4>
      <RenderForFeature flag={FeatureFlag.AdvancedSettings}>
        {#snippet enabled()}
          {@render settingsLinks()}
        {/snippet}
      </RenderForFeature>
    </div>
    <LogoutButton />
  </div>
</RenderFor>

<RenderFor audience="authenticated" device={["tablet-sm", "mobile"]}>
  <RenderForFeature flag={FeatureFlag.AdvancedSettings}>
    {#snippet enabled()}
      <div class="trakt-settings-navbar">
        {@render settingsLinks()}
      </div>
    {/snippet}
  </RenderForFeature>
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

    h5 {
      color: var(--color-text-secondary);
      font-weight: 600;
      transition: font-size var(--transition-increment) ease-in-out;
    }

    :global(.trakt-link) {
      text-decoration: none;
    }

    :global(.trakt-link.trakt-link-active) {
      :global(h5) {
        color: var(--color-text-primary);
        font-size: var(--ni-28);
      }
    }

    @include for-tablet-sm-and-below {
      flex-direction: row;
      align-items: center;

      h5 {
        font-size: var(--ni-18);
      }

      :global(.trakt-link.trakt-link-active) {
        :global(h5) {
          font-size: var(--ni-22);
        }
      }
    }
  }
</style>
