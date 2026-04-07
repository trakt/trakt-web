<script lang="ts">
  import FeatureFlagItems from "$lib/features/feature-flag/FeatureFlagItems.svelte";
  import { m } from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SettingsBlock from "./_internal/SettingsBlock.svelte";
</script>

<div class="trakt-preview-features">
  <SettingsBlock
    title={m.header_preview_features()}
    description={m.description_preview_features()}
  >
    <RenderFor audience="vip">
      <FeatureFlagItems classList="trakt-settings-feature-preview" />
    </RenderFor>

    <RenderFor audience="free">
      <UpsellCta source="preview-features">
        {m.text_vip_upsell_preview_features()}
      </UpsellCta>
    </RenderFor>
  </SettingsBlock>
</div>

<style>
  .trakt-preview-features {
    max-width: var(--ni-480);

    :global(.trakt-settings-feature-preview) {
      justify-content: space-between;
    }
  }
</style>
