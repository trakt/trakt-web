<script lang="ts">
  import FeatureFlagItems from "$lib/features/feature-flag/FeatureFlagItems.svelte";
  import { m } from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";
</script>

<SettingsSection
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
</SettingsSection>
