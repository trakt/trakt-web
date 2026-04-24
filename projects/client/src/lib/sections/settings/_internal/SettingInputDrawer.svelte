<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormDatePicker from "$lib/components/form/FormDatePicker.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { iffy } from "$lib/utils/function/iffy";

  type SaveResult = void | { error: string };

  type CommonProps = {
    onClose: () => void;
    title: string;
    isSaving?: boolean;
    isRequired: boolean;
    name: string;
  };

  type TextSettingProps = CommonProps & {
    type: "input" | "textarea";
    currentValue: string;
    onSave: (value: string) => Promise<SaveResult>;
  };

  type DateSettingProps = CommonProps & {
    type: "datepicker";
    currentValue: Date | undefined;
    onSave: (value: Date) => Promise<SaveResult>;
    label: string;
  };

  type SettingInputDrawerProps = TextSettingProps | DateSettingProps;

  const {
    onClose,
    title,
    isSaving = false,
    isRequired,
    name,
    ...rest
  }: SettingInputDrawerProps = $props();

  let value = $state(iffy(() => rest.currentValue));
  let saveError = $state<string | undefined>(undefined);

  async function handleSubmit() {
    let result: SaveResult;

    if (rest.type === "datepicker") {
      result = await rest.onSave(value as Date);
    } else {
      const trimmed = (value as string).trim();
      result = await rest.onSave(trimmed);
    }

    if (result?.error) {
      saveError = result.error;
      return;
    }

    onClose();
  }

  const handleValueChange = (newValue: typeof value) => {
    saveError = undefined;
    value = newValue;
  };

  const isDirty = $derived(rest.currentValue?.valueOf() !== value?.valueOf());

  const validation = $derived(
    isRequired
      ? {
          isValid: (val: string) => val.trim().length > 0,
          errorText: m.validation_text_settings_field({ name }),
        }
      : undefined,
  );

  const dateValidation = $derived(
    isRequired
      ? {
          isValid: (val: Date | undefined) => val != null,
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
      {#if rest.type === "textarea"}
        <FormTextArea
          placeholder={title}
          onChange={handleValueChange}
          disabled={isSaving}
          value={value as string}
          autofocus
          required={isRequired}
          {validation}
        />
      {:else if rest.type === "datepicker"}
        <FormDatePicker
          value={value as Date | undefined}
          onChange={handleValueChange}
          disabled={isSaving}
          label={rest.label}
          required={isRequired}
          validation={dateValidation}
        />
      {:else}
        <FormInput
          placeholder={title}
          onChange={handleValueChange}
          disabled={isSaving}
          value={value as string}
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

    padding: var(--ni-2) 0;
  }
</style>
