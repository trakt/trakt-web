<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LostSignalMark from "./_internal/LostSignalMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";
  import RetryAction from "./_internal/RetryAction.svelte";

  const { message }: { message?: string } = $props();
</script>

{#snippet mark()}
  <LostSignalMark />
{/snippet}

{#snippet caretIcon()}
  <CaretRightIcon />
{/snippet}

{#snippet actions()}
  <RetryAction />

  <Button
    variant="primary"
    color="default"
    style="ghost"
    href={UrlBuilder.status()}
    label={m.link_text_service_status()}
    icon={caretIcon}
  >
    {m.link_text_service_status()}
  </Button>
{/snippet}

<ErrorPage
  title={m.page_title_service_unavailable()}
  kicker={m.error_kicker_service_unavailable()}
  {mark}
  {actions}
>
  {#if message}
    <p>{message}</p>
  {:else}
    <p>{m.error_text_service_unavailable()}</p>
    <p>{m.error_text_service_unavailable_resume()}</p>
  {/if}
</ErrorPage>
