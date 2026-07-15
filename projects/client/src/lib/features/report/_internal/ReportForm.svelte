<script lang="ts">
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import SingleSelect from "$lib/components/select/SingleSelect.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { ReportError } from "../models/ReportError";
  import type { ReportParams } from "../models/ReportParams";
  import type { ReportReason } from "../models/ReportReason";
  import { reasonLabel } from "./reasonLabel";
  import { reasonsFor } from "./reasonsFor";
  import { toTranslatedReportError } from "./toTranslatedReportError";
  import { useReport } from "./useReport";

  type ReportFormProps = {
    params: ReportParams;
    onClose: () => void;
  };

  const { params, onClose }: ReportFormProps = $props();

  let reason = $state<ReportReason | null>(null);
  let message = $state("");
  let fieldsContainer: HTMLDivElement | undefined;

  const handleReasonSelect = (value: ReportReason) => {
    reason = value;
    requestAnimationFrame(() => {
      fieldsContainer?.querySelector("textarea")?.focus();
    });
  };

  const { submit, isSubmitting, error, dismissError } = useReport();

  const reasons = $derived(reasonsFor(params.type));
  const isValid = $derived(Boolean(reason) && message.trim().length > 0);
  const reasonOptions = $derived(
    reasons.map((value) => ({ value, label: reasonLabel(value) })),
  );

  const handleSubmit = async () => {
    if (!reason) return;

    const succeeded = await submit({
      params,
      reason,
      message: message.trim(),
    });

    if (succeeded) onClose();
  };

  const unknownHref = $derived(
    $error === ReportError.Unknown
      ? UrlBuilder.github.reportIssue()
      : undefined,
  );
</script>

<Form
  onSubmit={handleSubmit}
  onCancel={onClose}
  disabled={!isValid || $isSubmitting}
  isCancelDisabled={$isSubmitting}
  confirmButtonText={m.button_text_submit_report()}
  confirmButtonLabel={m.button_label_submit_report()}
>
  <div class="trakt-report-properties" bind:this={fieldsContainer}>
    <SingleSelect
      options={reasonOptions}
      value={reason}
      placeholder={m.input_placeholder_report_reason()}
      disabled={$isSubmitting}
      onChange={(value) => handleReasonSelect(value as ReportReason)}
    />

    <FormTextArea
      placeholder={m.input_placeholder_report_message()}
      value={message}
      onChange={(value) => (message = value)}
      disabled={$isSubmitting}
      required
      rows={4}
    />

    {#if $error}
      <DismissibleError
        message={toTranslatedReportError($error)}
        href={unknownHref}
        onDismiss={dismissError}
      />
    {/if}
  </div>
</Form>

<style lang="scss">
  .trakt-report-properties {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding-top: var(--ni-4);
  }

  :global(.trakt-form-textarea) {
    font-family: inherit;
    font-size: var(--font-size-text);
    font-weight: normal;
  }
</style>
