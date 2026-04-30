<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import EditModeIcon from "$lib/components/icons/EditModeIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import { FeatureFlag } from "../feature-flag/models/FeatureFlag";
  import { useEditMode } from "./useEditMode";

  const { toggle } = useEditMode();
</script>

<RenderForFeature flag={FeatureFlag.EditMode}>
  {#snippet enabled()}
    <ActionButton
      style="ghost"
      label={m.button_label_edit_mode()}
      size="small"
      onclick={toggle}
    >
      <EditModeIcon />
    </ActionButton>
  {/snippet}
</RenderForFeature>
