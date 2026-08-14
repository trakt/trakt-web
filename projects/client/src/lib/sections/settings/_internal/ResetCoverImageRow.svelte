<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CoverImageIcon from "$lib/components/icons/CoverImageIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import SettingsGroupRow from "./SettingsGroupRow.svelte";
  import SettingsRowControl from "./SettingsRowControl.svelte";
  import { useResetCoverImage } from "./useResetCoverImage.ts";

  const { resetCoverImage, hasCoverImage, isResettingCoverImage } =
    useResetCoverImage();

  const description = $derived(
    $hasCoverImage
      ? m.text_settings_cover_image_description()
      : m.text_settings_no_cover_image_description(),
  );
</script>

<SettingsGroupRow
  title={m.text_settings_cover_image()}
  {description}
  variant="custom"
>
  {#snippet icon()}<CoverImageIcon />{/snippet}

  <SettingsRowControl>
    <Button
      variant="secondary"
      style="outline"
      color="red"
      label={m.button_label_reset_cover_image()}
      onclick={resetCoverImage}
      disabled={!$hasCoverImage || $isResettingCoverImage}
    >
      {m.button_text_reset_cover_image()}
    </Button>
  </SettingsRowControl>
</SettingsGroupRow>
