<script lang="ts">
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import { m } from "$lib/features/i18n/messages.ts";
  import { actionToastStore } from "./_internal/actionToastStore.ts";
  import { ACTION_TOAST_DURATION } from "./constants/index.ts";

  const { isEnabled } = useFeatureFlag();
  const isActionConfirmationsEnabled = isEnabled(
    FeatureFlag.ActionConfirmations,
  );

  $effect(() => {
    actionToastStore.setEnabled($isActionConfirmationsEnabled);
  });

  const toast = $derived($actionToastStore);

  const dismiss = () => actionToastStore.dismiss();

  const snackbarAction = $derived.by(() => {
    const action = toast?.action;
    if (!action) {
      return undefined;
    }

    return {
      text: action.text,
      label: action.label,
      style: "outline" as const,
      onAction: async () => {
        // Dismiss first: the handler may queue a follow-up toast.
        actionToastStore.dismiss();

        try {
          await action.onAction();
        } catch {
          actionToastStore.notify({
            message: m.action_toast_action_failed(),
            variant: 'error',
          });
        }
      },
    };
  });
</script>

{#if toast}
  <Snackbar
    open
    onDismiss={dismiss}
    message={toast.message}
    action={snackbarAction}
    variant={toast.variant}
    dismissDurationMs={ACTION_TOAST_DURATION}
    dismissResetKey={toast.id}
  />
{/if}
