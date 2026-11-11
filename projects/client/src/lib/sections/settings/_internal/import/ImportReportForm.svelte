<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { IssueReportError } from "$lib/features/issue-report/models/IssueReportError.ts";
  import { useIssueReport } from "$lib/features/issue-report/useIssueReport.ts";
  import type { ImportSourceConfig } from "$lib/sections/settings/import/ImportTypes.ts";
  import { dropzone } from "$lib/utils/actions/dropzone.ts";
  import { untrack } from "svelte";

  type ImportReportFormProps = {
    config: ImportSourceConfig;
    attachedFiles: ReadonlyArray<File>;
    onclose: () => void;
  };

  const MAX_FILES = 10;

  const { config, attachedFiles, onclose }: ImportReportFormProps = $props();

  const { submit, isSubmitting, error, dismissError } = useIssueReport();

  let message = $state("");
  let files = $state<File[]>(untrack(() => [...attachedFiles]));
  let showSuccess = $state(false);

  const isValid = $derived(message.trim().length > 0 && files.length > 0);
  const hasAttachedFiles = $derived(
    attachedFiles.some((file) => files.includes(file)),
  );

  const addFiles = (list: FileList) => {
    const incoming = Array.from(list).filter((file) => file.size > 0);

    const merged = incoming.reduce<File[]>(
      (acc, file) => {
        const isDuplicate = acc.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size,
        );
        return isDuplicate ? acc : [...acc, file];
      },
      [...files],
    );

    files = merged.slice(0, MAX_FILES);
  };

  const handleDrop = (event: Event) => {
    const { files: dropped } = (event as CustomEvent<{ files: FileList }>)
      .detail;
    if (dropped?.length) addFiles(dropped);
  };

  const removeFile = (index: number) => {
    files = files.filter((_, i) => i !== index);
  };

  const resetForm = () => {
    message = "";
    files = [...attachedFiles];
    dismissError();
  };

  const cancel = () => {
    resetForm();
    onclose();
  };

  const errorMessage = $derived.by(() => {
    switch ($error) {
      case IssueReportError.TooLarge:
        return m.issue_report_error_too_large();
      case IssueReportError.Unknown:
        return m.issue_report_error_unknown();
      default:
        return null;
    }
  });

  const handleSubmit = async () => {
    const succeeded = await submit({
      kind: "import",
      source: config.id,
      sourceName: config.name,
      message: message.trim(),
      files,
    });

    if (!succeeded) return;

    resetForm();
    showSuccess = true;
  };
</script>

<div class="trakt-import-report-form">
  <div class="report-intro">
    <p class="bold">{m.import_report_heading()}</p>
    <p class="secondary">{m.import_report_description()}</p>
  </div>

  <Form
    onSubmit={handleSubmit}
    onCancel={cancel}
    disabled={!isValid || $isSubmitting}
    isCancelDisabled={$isSubmitting}
    confirmButtonText={m.issue_report_submit_text()}
    confirmButtonLabel={m.issue_report_submit_label()}
  >
    <div class="report-fields">
      <FormTextArea
        placeholder={m.import_report_message_placeholder()}
        value={message}
        onChange={(value) => (message = value)}
        disabled={$isSubmitting}
        required
        rows={4}
      />

      <div
        class="report-dropzone"
        use:dropzone={{ accept: config.accept, multiple: true }}
        onfiles={handleDrop}
      >
        <p class="secondary">
          {m.import_report_upload_prompt({ source: config.name })}
        </p>
        <p class="secondary tag">{m.import_max_files({ count: MAX_FILES })}</p>
      </div>

      {#if files.length > 0}
        <ul class="report-files">
          {#each files as file, index (file.name + file.size)}
            <li class="report-file">
              <span class="secondary ellipsis">{file.name}</span>
              <ActionButton
                size="small"
                onclick={() => removeFile(index)}
                label={m.issue_report_remove_file_label()}
                color="red"
                style="ghost"
                variant="secondary"
                type="button"
              >
                <CloseIcon />
              </ActionButton>
            </li>
          {/each}
        </ul>
      {/if}

      {#if hasAttachedFiles}
        <p class="secondary tag">{m.import_report_skipped_note()}</p>
      {/if}

      {#if errorMessage}
        <DismissibleError message={errorMessage} onDismiss={dismissError} />
      {/if}
    </div>
  </Form>
</div>

<Snackbar
  open={showSuccess}
  onDismiss={() => (showSuccess = false)}
  message={m.issue_report_success()}
/>

<style lang="scss">
  .trakt-import-report-form {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
  }

  .report-intro {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }

  .report-fields {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .report-dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--gap-xs);

    -webkit-tap-highlight-color: transparent;

    padding: var(--ni-24) var(--ni-20);
    min-height: var(--ni-104);

    border: var(--ni-2) dashed
      color-mix(in srgb, var(--color-border) 60%, transparent);
    border-radius: var(--border-radius-m);

    cursor: pointer;
    transition:
      border-color var(--transition-increment) ease-in-out,
      background-color var(--transition-increment) ease-in-out;

    &:hover,
    &:focus-visible,
    &:global(.dragover) {
      border-color: var(--color-primary);
      background-color: color-mix(
        in srgb,
        var(--color-primary) 5%,
        transparent
      );
      outline: none;
    }
  }

  .report-files {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    margin: 0;
    padding: 0;
    list-style: none;
  }

  .report-file {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--gap-s);
  }
</style>
