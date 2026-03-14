<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy";

  type SettingInputDrawerProps = {
    onClose: () => void;
    onSave: (value: string) => Promise<void | {
      error: string;
    }>;
    title: string;
    currentValue: string;
    isSaving?: boolean;
    isRequired: boolean;
    type: "input" | "textarea";
    name: string;
  };

  const {
    onClose,
    onSave,
    title,
    currentValue,
    isSaving = false,
    isRequired,
    type,
    name,
  }: SettingInputDrawerProps = $props();

  let value = $state(iffy(() => currentValue));
  let saveError = $state<string | undefined>(undefined);

  async function handleSubmit() {
    const result = await onSave(value.trim());
    if (result?.error) {
      saveError = result.error;
      return;
    }

    onClose();
  }

  const handleValueChange = (newValue: string) => {
    saveError = undefined;
    value = newValue;
  };

  const isDirty = $derived(currentValue !== value);

  const validation = $derived(
    isRequired
      ? {
          isValid: (val: string) => val.trim().length > 0,
          errorText: m.validation_text_settings_field({ name }),
        }
      : undefined,
  );
</script>

<Drawer {onClose} {title} size="auto">
  <Form
    onSubmit={handleSubmit}
    onCancel={onClose}
    disabled={isSaving || !isDirty}
    isCancelDisabled={isSaving}
    confirmButtonText={m.button_text_apply()}
    confirmButtonLabel={m.button_label_apply()}
  >
    <div class="trakt-setting-input-content">
      {#if type === "textarea"}
        <FormTextArea
          placeholder={title}
          onChange={handleValueChange}
          disabled={isSaving}
          {value}
          autofocus
          required={isRequired}
          {validation}
        />
      {:else}
        <FormInput
          placeholder={title}
          onChange={handleValueChange}
          disabled={isSaving}
          {value}
          autofocus
          required={isRequired}
          {validation}
        />
      {/if}

      {#if saveError}
        <DismissibleError
          message={saveError}
          onDismiss={() => (saveError = undefined)}
        />
      {/if}
    </div>
  </Form>
</Drawer>

<style>
  .trakt-setting-input-content {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
