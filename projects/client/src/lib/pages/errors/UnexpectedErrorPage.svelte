<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";

  type UnexpectedErrorPageProps = {
    error?: Error;
    sessionId?: string;
  };

  const { error, sessionId }: UnexpectedErrorPageProps = $props();
</script>

<ErrorPage title={m.page_title_unexpected_error()}>
  <div class="trakt-unexpected-error">
    <div class="trakt-error-message">
      <p>
        <MessageWithLink
          message={m.error_text_unexpected_error()}
          href={UrlBuilder.github.reportIssue()}
          target="_blank"
        />
      </p>
      <Button
        variant="primary"
        color="purple"
        onclick={() => window.location.reload()}
        label={m.button_label_retry()}
      >
        {m.button_text_retry()}
      </Button>
    </div>

    {#if sessionId || error?.stack}
      <div class="trakt-error-details">
        <p class="trakt-error-details-header">
          {m.error_text_unexpected_error_include_details()}
        </p>

        {#if sessionId}
          <span class="tag bold">Session ID</span>
          <code>{sessionId}</code>
        {/if}

        {#if error?.stack}
          <span class="tag bold">Stack trace</span>
          <pre>{error.stack}</pre>
        {/if}
      </div>
    {/if}
  </div>
</ErrorPage>

<style>
  .trakt-unexpected-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-xxl);
  }

  .trakt-error-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--gap-l);

    text-align: center;
  }

  .trakt-error-details {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    gap: var(--gap-s) var(--gap-m);

    max-width: var(--ni-640);

    padding: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    border: var(--ni-1) solid var(--color-border);

    text-align: left;

    .trakt-error-details-header {
      grid-column: 1 / -1;
    }

    code,
    pre {
      user-select: all;
      font-size: var(--font-size-tag);
    }

    pre {
      max-height: var(--ni-280);
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }
</style>
