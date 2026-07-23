<script lang="ts">
  import GlobeIcon from "$lib/components/icons/GlobeIcon.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import MediaIcon from "$lib/components/icons/MediaIcon.svelte";
  import MenuIcon from "$lib/components/icons/MenuIcon.svelte";
  import ThemeIcon from "$lib/components/icons/ThemeIcon.svelte";
  import Switch from "$lib/components/toggles/Switch.svelte";
  import { useAppearance } from "$lib/features/appearance/useAppearance.ts";
  import LocalePicker from "$lib/features/i18n/components/LocalePicker.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ThemePicker from "$lib/features/theme/components/ThemePicker.svelte";
  import SettingsGroupCard from "./_internal/SettingsGroupCard.svelte";
  import SettingsGroupRow from "./_internal/SettingsGroupRow.svelte";

  const { showTitle = true }: { showTitle?: boolean } = $props();

  const {
    reduceVisualNoise,
    reduceWidth,
    centerDrawers,
    setReduceVisualNoise,
    setReduceWidth,
    setCenterDrawers,
  } = useAppearance();
</script>

<SettingsGroupCard title={showTitle ? m.header_appearance() : undefined}>
  <SettingsGroupRow title={m.text_theme()} variant="custom">
    {#snippet icon()}<ThemeIcon />{/snippet}
    <ThemePicker />
  </SettingsGroupRow>

  <SettingsGroupRow title={m.text_language()} variant="custom">
    {#snippet icon()}<GlobeIcon />{/snippet}
    <LocalePicker />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_settings_reduce_visual_noise()}
    description={m.text_settings_reduce_visual_noise_description()}
    variant="custom"
  >
    {#snippet icon()}<CoverImageIcon />{/snippet}
    <Switch
      label={m.switch_label_reduce_visual_noise()}
      checked={$reduceVisualNoise}
      onclick={() => setReduceVisualNoise(!$reduceVisualNoise)}
      color="purple"
    />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_settings_reduce_width()}
    description={m.text_settings_reduce_width_description()}
    variant="custom"
  >
    {#snippet icon()}<MenuIcon state={$reduceWidth ? "open" : "closed"} />{/snippet}
    <Switch
      label={m.switch_label_reduce_width()}
      checked={$reduceWidth}
      onclick={() => setReduceWidth(!$reduceWidth)}
      color="purple"
    />
  </SettingsGroupRow>

  <SettingsGroupRow
    title={m.text_settings_center_drawers()}
    description={m.text_settings_center_drawers_description()}
    variant="custom"
  >
    {#snippet icon()}<MediaIcon />{/snippet}
    <Switch
      label={m.switch_label_center_drawers()}
      checked={$centerDrawers}
      onclick={() => setCenterDrawers(!$centerDrawers)}
      color="purple"
    />
  </SettingsGroupRow>
</SettingsGroupCard>
