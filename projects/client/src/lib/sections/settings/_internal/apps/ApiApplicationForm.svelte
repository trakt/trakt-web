<script lang="ts">
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ApiApplicationFormProps } from "./ApiApplicationFormProps.ts";
  import { isValidCorsOrigin } from "./isValidCorsOrigin.ts";
  import { isValidRedirectUri } from "./isValidRedirectUri.ts";
  import { toCanonicalOrigin } from "./toCanonicalOrigin.ts";

  const NAME_MAX_LENGTH = 255;
  const DESCRIPTION_MAX_LENGTH = 255;
  const REDIRECT_URI_MAX_COUNT = 25;
  const REDIRECT_URI_MAX_LENGTH = 2048;
  const ORIGINS_MAX_COUNT = 25;
  const ORIGINS_MAX_LENGTH = 255;

  const {
    initial,
    isBusy = false,
    errorMessage,
    onDismissError,
    confirmButtonText,
    confirmButtonLabel,
    onSubmit,
    onCancel,
  }: ApiApplicationFormProps = $props();

  // One-time seed: a form instance edits a single application, so callers
  // mount a fresh one per application rather than swapping `initial`.
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
  const canonicalOrigins = $derived(origins.map(toCanonicalOrigin));

  const toRedirectUriValue = (uris: ReadonlyArray<string>) => uris.join("\n");
  const toOriginsValue = (values: ReadonlyArray<string>) =>
    values.map(toCanonicalOrigin).join(" ");

  const toNameError = (value: string) => {
    const trimmed = value.trim();

    if (trimmed.length === 0) {
      return m.validation_text_app_name();
    }

    if (trimmed.length > NAME_MAX_LENGTH) {
      return m.validation_text_app_name_too_long({ count: NAME_MAX_LENGTH });
    }

    return null;
  };

  const toDescriptionError = (value: string) =>
    value.trim().length > DESCRIPTION_MAX_LENGTH
      ? m.validation_text_app_description_too_long({
        count: DESCRIPTION_MAX_LENGTH,
      })
      : null;

  const toRedirectUriError = (value: string) => {
    const uris = toLines(value);

    if (uris.length === 0) {
      return m.validation_text_app_redirect_uris();
    }

    if (uris.length > REDIRECT_URI_MAX_COUNT) {
      return m.validation_text_app_redirect_uris_too_many({
        count: REDIRECT_URI_MAX_COUNT,
      });
    }

    if (toRedirectUriValue(uris).length > REDIRECT_URI_MAX_LENGTH) {
      return m.validation_text_app_redirect_uris_too_long({
        count: REDIRECT_URI_MAX_LENGTH,
      });
    }

    if (!uris.every(isValidRedirectUri)) {
      return m.validation_text_app_redirect_uris_invalid();
    }

    return null;
  };

  const toOriginsError = (value: string) => {
    const values = toLines(value);

    if (values.length > ORIGINS_MAX_COUNT) {
      return m.validation_text_app_origins_too_many({
        count: ORIGINS_MAX_COUNT,
      });
    }

    if (toOriginsValue(values).length > ORIGINS_MAX_LENGTH) {
      return m.validation_text_app_origins_too_long({
        count: ORIGINS_MAX_LENGTH,
      });
    }

    if (!values.every(isValidCorsOrigin)) {
      return m.validation_text_app_origins();
    }

    return null;
  };

  const nameError = $derived(toNameError(name));
  const descriptionError = $derived(toDescriptionError(description));
  const redirectUriError = $derived(toRedirectUriError(redirectUriText));
  const originsError = $derived(toOriginsError(originsText));

  const nameValidation = $derived({
    isValid: (value: string) => toNameError(value) === null,
    errorText: nameError ?? m.validation_text_app_name(),
  });

  const descriptionValidation = {
    isValid: (value: string) => toDescriptionError(value) === null,
    errorText: m.validation_text_app_description_too_long({
      count: DESCRIPTION_MAX_LENGTH,
    }),
  };

  const redirectUriValidation = $derived({
    isValid: (value: string) => toRedirectUriError(value) === null,
    errorText: redirectUriError ?? m.validation_text_app_redirect_uris(),
  });

  const originsValidation = $derived({
    isValid: (value: string) => toOriginsError(value) === null,
    errorText: originsError ?? m.validation_text_app_origins(),
  });

  const isValid = $derived(
    nameError === null &&
      descriptionError === null &&
      redirectUriError === null &&
      originsError === null,
  );

  function handleSubmit() {
    if (!isValid) {
      return;
    }

    onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      redirectUris,
      origins: canonicalOrigins,
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
        validation={nameValidation}
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
        validation={descriptionValidation}
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
        validation={redirectUriValidation}
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
        validation={originsValidation}
      />
      <span class="field-hint secondary tag">{m.hint_app_origins()}</span>
    </div>

    {#if errorMessage}
      <DismissibleError message={errorMessage} onDismiss={onDismissError} />
    {/if}
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
