<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import { actionToastStore } from "./_internal/actionToastStore.ts";
  import { ACTION_TOAST_DURATION } from "./constants/index.ts";

  const { isEnabled } = useFeatureFlag();
  const isActionConfirmationsEnabled = isEnabled(
    FeatureFlag.ActionConfirmations,
  );

  // The store gates every `notify` on this flag, so mutation hooks can fire
  // unconditionally and stay silent until the flag turns on.
  $effect(() => {
    actionToastStore.setEnabled($isActionConfirmationsEnabled);
  });

  const toast = $derived($actionToastStore);

  const dismiss = () => actionToastStore.dismiss(toast?.id);

  const snackbarAction = $derived.by(() => {
    const action = toast?.action;
    if (!action) {
      return undefined;
    }

    return {
      text: action.text,
      label: action.label,
      style: action.style,
      onAction: () => {
        // Clear the toast up front so the tap feels instant; the handler
        // (undo re-add, open drawer, …) may queue its own follow-up toast.
        actionToastStore.dismiss(toast?.id);
        void action.onAction();
      },
    };
  });
</script>

{#if toast}
  <Snackbar
    open
    onDismiss={dismiss}
    title={toast.title}
    message={toast.message}
    action={snackbarAction}
    variant={toast.variant}
    dismissDurationMs={toast.durationMs ?? ACTION_TOAST_DURATION}
  />
{/if}
