<script lang="ts">
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ApiApplicationFormProps } from "./ApiApplicationFormProps.ts";

  const {
    initial,
    isBusy = false,
    confirmButtonText,
    confirmButtonLabel,
    onSubmit,
    onCancel,
  }: ApiApplicationFormProps = $props();

  // One-time seed: the parent only mounts this form once `initial` is
  // available and never swaps it afterwards, so snapshotting is intentional.
  // svelte-ignore state_referenced_locally
  const seed = initial;
  let name = $state(seed?.name ?? "");
  let description = $state(seed?.description ?? "");
  let redirectUriText = $state(seed?.redirectUriText ?? "");
  let originsText = $state(seed?.originsText ?? "");

  const toLines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

  const redirectUris = $derived(toLines(redirectUriText));
  const origins = $derived(toLines(originsText));

  const isValid = $derived(
    name.trim().length > 0 && redirectUris.length > 0,
  );

  function handleSubmit() {
    if (!isValid) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      redirectUris,
      origins,
    });
  }
</script>

<div class="trakt-api-application-form">
  <Form
    onSubmit={handleSubmit}
    {onCancel}
    disabled={isBusy || !isValid}
    isCancelDisabled={isBusy}
    {confirmButtonText}
    {confirmButtonLabel}
    inlineActions
  >
    <div class="fields">
    <div class="field">
      <span class="secondary tag">{m.label_app_name()}</span>
      <FormInput
        placeholder={m.input_placeholder_app_name()}
        onChange={(value) => (name = value)}
        disabled={isBusy}
        value={name}
        autofocus
        required
        validation={{
          isValid: (value) => value.trim().length > 0,
          errorText: m.validation_text_app_name(),
        }}
      />
    </div>

    <div class="field">
      <span class="secondary tag">{m.label_app_description()}</span>
      <FormTextArea
        placeholder=""
        onChange={(value) => (description = value)}
        disabled={isBusy}
        value={description}
        rows={3}
      />
      <span class="field-hint secondary tag">{m.hint_app_description()}</span>
    </div>

    <div class="field">
      <span class="secondary tag">{m.label_app_redirect_uris()}</span>
      <FormTextArea
        placeholder={m.input_placeholder_app_redirect_uris()}
        onChange={(value) => (redirectUriText = value)}
        disabled={isBusy}
        value={redirectUriText}
        rows={4}
        required
        validation={{
          isValid: (value) => toLines(value).length > 0,
          errorText: m.validation_text_app_redirect_uris(),
        }}
      />
      <span class="field-hint secondary tag">{m.hint_app_redirect_uris()}</span>
    </div>

    <div class="field">
      <span class="secondary tag">{m.label_app_origins()}</span>
      <FormTextArea
        placeholder={m.input_placeholder_app_origins()}
        onChange={(value) => (originsText = value)}
        disabled={isBusy}
        value={originsText}
        rows={3}
      />
      <span class="field-hint secondary tag">{m.hint_app_origins()}</span>
    </div>
  </div>
  </Form>
</div>

<style lang="scss">
  .trakt-api-application-form {
    padding: var(--gap-m);
  }

  .fields {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--ni-4);
    min-width: 0;
  }

  .field-hint {
    padding: 0 var(--ni-4);
  }
</style>
