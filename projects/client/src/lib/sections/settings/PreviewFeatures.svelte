<script lang="ts">
  import FeatureFlagItems from "$lib/features/feature-flag/FeatureFlagItems.svelte";
  import { useUnreadPreviewFeatures } from "$lib/features/feature-flag/useUnreadPreviewFeatures.ts";
  import { m } from "$lib/features/i18n/messages";
  import UpsellCta from "$lib/features/upsell/UpsellCta.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { onMount } from "svelte";
  import SettingsSection from "./_internal/SettingsSection.svelte";

  const { unreadFeatures, markAllRead } = useUnreadPreviewFeatures();

  // Snapshot of the unread ids taken when the section mounts, so the NEW
  // tags stay visible for the visit in which the user first sees them.
  let newFeatures = $state<ReadonlyArray<string>>([]);

  onMount(() => {
    newFeatures = $unreadFeatures;
    markAllRead();
  });
</script>

<SettingsSection
  title={m.header_preview_features()}
  description={m.description_preview_features()}
>
  <RenderFor audience="vip">
    <FeatureFlagItems classList="trakt-settings-feature-preview" {newFeatures} />
  </RenderFor>

  <RenderFor audience="free">
    <UpsellCta source="preview-features">
      {m.text_vip_upsell_preview_features()}
    </UpsellCta>
  </RenderFor>
</SettingsSection>
