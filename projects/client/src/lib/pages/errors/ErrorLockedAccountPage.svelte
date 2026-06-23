<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";

  const { message = "" }: { message?: string } = $props();

  const lockType = $derived.by(() => {
    if (message.toLowerCase().includes("collection has exceeded")) {
      return "collection_limit";
    }

    return "usage_limit";
  });
</script>

<ErrorPage title={m.page_title_account_locked()}>
  {#if lockType === "collection_limit"}
    <p>
      <MessageWithLink
        message={m.error_text_locked_account_collection_limit()}
        href={UrlBuilder.og.support()}
        target="_blank"
      />
    </p>
  {:else}
    <p>
      <MessageWithLink
        message={m.error_text_locked_account_guide()}
        href={UrlBuilder.settings.advanced({ section: "advanced" })}
        target="_self"
      />
    </p>
    <p>
      <MessageWithLink
        message={m.error_text_locked_account_persists()}
        href={UrlBuilder.og.support()}
        target="_blank"
      />
    </p>
  {/if}
</ErrorPage>
