<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import RetryIcon from "$lib/components/icons/RetryIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import LostSignalMark from "./_internal/LostSignalMark.svelte";
  import ErrorPage from "./ErrorPage.svelte";

  const { message }: { message?: string } = $props();
</script>

<ErrorPage
  title={m.page_title_service_unavailable()}
  kicker={m.error_kicker_service_unavailable()}
  message={message ?? m.error_text_service_unavailable()}
  mark={mark}
  {actions}
/>

{#snippet mark()}
  <LostSignalMark />
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

  <Button
    variant="primary"
    color="default"
    style="ghost"
    shape="pill"
    href={UrlBuilder.status()}
    label={m.link_text_service_status()}
    icon={caretIcon}
  >
    {m.link_text_service_status()}
  </Button>
{/snippet}

{#snippet retryIcon()}
  <RetryIcon />
{/snippet}

{#snippet caretIcon()}
  <CaretRightIcon />
{/snippet}
