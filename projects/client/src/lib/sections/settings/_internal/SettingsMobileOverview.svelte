<script lang="ts">
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import SettingsGroupCard from "./SettingsGroupCard.svelte";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import { useSettings } from "./useSettings.ts";

  const { watchAgain, spoilers, ratingPrompt, isSavingSettings } =
    useSettings();
</script>

<div class="trakt-settings-mobile-overview">
  <SettingsGroupCard title={m.header_behavior()}>
    <SettingsGroupRow title={m.text_show_spoilers()} variant="custom">
      <Switch
        label={m.switch_label_spoilers()}
        checked={!$spoilers.isHidden}
        onclick={() => $spoilers.set(!$spoilers.isHidden)}
        disabled={$isSavingSettings}
        color="purple"
      />
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.text_settings_enable_multiple_plays()}
      variant="custom"
    >
      <Switch
        label={m.switch_label_multiple_watches()}
        checked={$watchAgain.hasWatchAgain}
        onclick={() => $watchAgain.set(!$watchAgain.hasWatchAgain)}
        disabled={$isSavingSettings}
        color="purple"
      />
    </SettingsGroupRow>

    <SettingsGroupRow
      title={m.text_settings_show_rating_prompt()}
      variant="custom"
    >
      <Switch
        label={m.switch_label_rating_prompt()}
        checked={$ratingPrompt.showRatingPrompt}
        onclick={() => $ratingPrompt.set(!$ratingPrompt.showRatingPrompt)}
        disabled={$isSavingSettings}
        color="purple"
      />
    </SettingsGroupRow>
  </SettingsGroupCard>

  <SettingsGroupCard title={m.header_sync()}>
    <SettingsGroupRow
      title={m.link_text_streaming_sync_settings()}
      variant="link"
      href={UrlBuilder.settings.streamingServices()}
    />

    <RenderForFeature flag={FeatureFlag.PlexSync}>
      {#snippet enabled()}
        <SettingsGroupRow
          title={m.link_text_plex_settings()}
          variant="link"
          href={UrlBuilder.settings.plex()}
        />
      {/snippet}
    </RenderForFeature>
  </SettingsGroupCard>

  <SettingsGroupCard title={m.link_text_apps_settings()}>
    <SettingsGroupRow
      title={m.heading_connected_apps()}
      variant="link"
      href={UrlBuilder.settings.appsConnected()}
    />

    <SettingsGroupRow
      title={m.heading_api_applications()}
      variant="link"
      href={UrlBuilder.settings.appsApi()}
    />
  </SettingsGroupCard>

  <SettingsGroupCard title={m.header_more_settings()}>
    <SettingsGroupRow
      title={m.link_text_data_settings()}
      variant="link"
      href={UrlBuilder.settings.data()}
    />

    <SettingsGroupRow
      title={m.link_text_advanced_settings()}
      variant="link"
      href={UrlBuilder.settings.advanced()}
    />

    <SettingsGroupRow
      title={m.link_text_preview_settings()}
      variant="link"
      href={UrlBuilder.settings.preview()}
    />
  </SettingsGroupCard>
</div>

<style lang="scss">
  .trakt-settings-mobile-overview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xl);
  }
</style>
