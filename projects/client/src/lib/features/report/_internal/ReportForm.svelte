<script lang="ts">
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import type { ReportParams } from "../models/ReportParams";
  import { ReportError } from "../models/ReportError";
  import type { ReportReason } from "../models/ReportReason";
  import { reasonsFor } from "./reasonsFor";
  import { reasonLabel } from "./reasonLabel";
  import { toTranslatedReportError } from "./toTranslatedReportError";
  import { useReport } from "./useReport";

  type ReportFormProps = {
    params: ReportParams;
    onClose: () => void;
  };

  const { params, onClose }: ReportFormProps = $props();

  let reason = $state<ReportReason | "">("");
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
  const isValid = $derived(reason !== "" && message.trim().length > 0);
  const reasonButtonLabel = $derived(
    reason === ""
      ? m.input_placeholder_report_reason()
      : reasonLabel(reason),
  );

  const handleSubmit = async () => {
    if (reason === "") return;

    const succeeded = await submit({
      params,
      reason,
      message: message.trim(),
    });

    if (succeeded) onClose();
  };

  const unknownHref = $derived(
    $error === ReportError.Unknown ? UrlBuilder.github.reportIssue() : undefined,
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
    <div
      class="trakt-report-reason"
      class:is-placeholder={reason === ""}
    >
      <DropdownList
        label={reasonButtonLabel}
        variant="secondary"
        size="small"
        style="flat"
        color="default"
        preferNative
        disabled={$isSubmitting}
      >
        {reasonButtonLabel}
        {#snippet items()}
          {#each reasons as value (value)}
            <DropdownItem
              color="blue"
              disabled={value === reason}
              onclick={() => handleReasonSelect(value)}
            >
              {reasonLabel(value)}
            </DropdownItem>
          {/each}
        {/snippet}
      </DropdownList>
    </div>

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
  }

  .trakt-report-reason {
    :global(.trakt-button) {
      justify-content: space-between;

      padding: var(--ni-12);
      min-height: unset;

      background-color: var(--color-input-background);
      color: var(--color-text-primary);
      border: var(--border-thickness-xxs) var(--color-border) solid;
      border-radius: var(--border-radius-s);
      backdrop-filter: blur(var(--ni-4));

      transition: border-color var(--transition-increment) ease-in-out;

      &:focus-visible {
        border-color: var(--color-input-focus);
      }
    }

    :global(.trakt-button[disabled]) {
      opacity: 0.6;
    }

    :global(.trakt-button .button-label p) {
      font-size: var(--font-size-text);
      font-weight: normal;
      text-transform: none;
    }

    &.is-placeholder :global(.trakt-button) {
      color: var(--color-text-secondary);
    }
  }

  :global(.trakt-form-textarea) {
    font-family: inherit;
    font-size: var(--font-size-text);
    font-weight: normal;
  }
</style>
