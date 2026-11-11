<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DismissibleError from "$lib/components/errors/DismissibleError.svelte";
  import Form from "$lib/components/form/Form.svelte";
  import FormInput from "$lib/components/form/FormInput.svelte";
  import FormTextArea from "$lib/components/form/FormTextArea.svelte";
  import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
  import { AnalyticsEvent } from "$lib/features/analytics/events/AnalyticsEvent.ts";
  import { useTrack } from "$lib/features/analytics/useTrack.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { isReputableLink } from "$lib/features/issue-report/isReputableLink.ts";
  import { useIssueReport } from "$lib/features/issue-report/useIssueReport.ts";
  import type { SearchResponse } from "$lib/features/search/models/SearchResponse.ts";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode.ts";
  import { toReportedSearchResults } from "./_internal/toReportedSearchResults.ts";

  const {
    query,
    mode,
    results,
  }: {
    query: string;
    mode: SearchMode;
    results?: SearchResponse | null;
  } = $props();

  const { track: trackOpen } = useTrack(AnalyticsEvent.IssueReportOpen);
  const { submit, isSubmitting, error, dismissError } = useIssueReport();

  type SearchSnapshot = {
    query: string;
    mode: SearchMode;
    results: ReadonlyArray<string>;
  };

  let snapshot = $state<SearchSnapshot | null>(null);
  let searchedFor = $state("");
  let link = $state("");
  let expected = $state("");
  let showSuccess = $state(false);

  const linkValidation = {
    errorText: m.search_report_link_error(),
    isValid: isReputableLink,
  };

  const isValid = $derived(
    searchedFor.trim().length > 0 &&
      isReputableLink(link) &&
      expected.trim().length > 0,
  );

  const open = () => {
    snapshot = { query, mode, results: toReportedSearchResults(results) };
    searchedFor = query;
    link = "";
    expected = "";
    dismissError();
    trackOpen({ kind: "search", source: mode });
  };

  const close = () => {
    snapshot = null;
  };

  const handleSubmit = async () => {
    if (!snapshot) return;

    const succeeded = await submit({
      kind: "search",
      ...snapshot,
      intent: searchedFor.trim(),
      link: link.trim(),
      expected: expected.trim(),
    });

    if (!succeeded) return;

    close();
    showSuccess = true;
  };
</script>

<div class="trakt-search-report">
  <p class="secondary">{m.search_report_prompt()}</p>
  <Button
    label={m.button_label_report_search()}
    onclick={open}
    color="default"
    variant="secondary"
    size="small"
  >
    {m.button_text_report_search()}
  </Button>
</div>

{#if snapshot}
  <Drawer onClose={close} title={m.search_report_heading()} size="auto">
    <Form
      onSubmit={handleSubmit}
      onCancel={close}
      disabled={!isValid || $isSubmitting}
      isCancelDisabled={$isSubmitting}
      confirmButtonText={m.issue_report_submit_text()}
      confirmButtonLabel={m.issue_report_submit_label()}
    >
      <div class="search-report-fields">
        <p class="secondary">{m.search_report_description()}</p>
        <FormInput
          placeholder={m.search_report_query_placeholder()}
          value={searchedFor}
          onChange={(value) => (searchedFor = value)}
          disabled={$isSubmitting}
          required
        />
        <FormInput
          type="url"
          placeholder={m.search_report_link_placeholder()}
          value={link}
          onChange={(value) => (link = value)}
          disabled={$isSubmitting}
          validation={linkValidation}
          autofocus
          required
        />
        <FormTextArea
          placeholder={m.search_report_expected_placeholder()}
          value={expected}
          onChange={(value) => (expected = value)}
          disabled={$isSubmitting}
          required
          rows={4}
        />
        {#if $error}
          <DismissibleError
            message={m.issue_report_error_unknown()}
            onDismiss={dismissError}
          />
        {/if}
      </div>
    </Form>
  </Drawer>
{/if}

<Snackbar
  open={showSuccess}
  onDismiss={() => (showSuccess = false)}
  message={m.issue_report_success()}
/>

<style>
  .trakt-search-report {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: var(--gap-s);

    padding: var(--gap-xl) var(--layout-distance-side);
  }

  .search-report-fields {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }
</style>
