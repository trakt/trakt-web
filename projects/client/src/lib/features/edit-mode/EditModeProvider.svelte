<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { useFeatureFlag } from "../feature-flag/useFeatureFlag";
  import { createEditModeContext } from "./_internal/createEditModeContext";
  import { useEditMode } from "./useEditMode";

  const { children }: ChildrenProps = $props();

  createEditModeContext();

  const { exit } = useEditMode();
  const { isEnabled } = useFeatureFlag();

  // FIXME: when removing the feature flag, add tracking
  // const isEditModeEnabled = $derived(isEnabled(FeatureFlag.EditMode));

  // $effect(() => {
  //   if (!$isEditModeEnabled) {
  //     exit();
  //   }
  // });

  afterNavigate((_) => {
    exit();
  });
</script>

{@render children()}
