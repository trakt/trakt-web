<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import BadTakeMark from "./_internal/BadTakeMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";

  type UnexpectedErrorPageProps = {
    error?: Error;
    sessionId?: string;
  };

  const { error, sessionId }: UnexpectedErrorPageProps = $props();
</script>

<ErrorPage
  title={m.page_title_unexpected_error()}
  kicker={m.error_kicker_unexpected_error()}
  {mark}
  {actions}
>
  <p>
    <MessageWithLink
      message={m.error_text_unexpected_error()}
      href={UrlBuilder.github.reportIssue()}
      target="_blank"
    />
  </p>

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
</ErrorPage>

{#snippet mark()}
  <BadTakeMark />
{/snippet}

{#snippet actions()}
  <Button
    variant="primary"
    color="purple"
    style="outline"
    shape="pill"
    onclick={() => window.location.reload()}
    label={m.button_label_retry()}
    icon={retryIcon}
    iconPlacement="start"
  >
    {m.button_text_retry()}
  </Button>
{/snippet}

{#snippet retryIcon()}
  <RetryIcon />
{/snippet}

<style>
  .trakt-error-details {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: baseline;
    gap: var(--gap-s) var(--gap-m);

    width: 100%;

    padding: var(--ni-16);
    box-sizing: border-box;

    border-radius: var(--border-radius-m);
    border: var(--border-thickness-xxs) solid var(--color-error-page-border);

    text-align: start;
    /* The body balances its prose lines; a stack trace must not be reflowed. */
    text-wrap: wrap;

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
