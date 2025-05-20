<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.error_page_locked_account_title()}>
  <p>
    <MessageWithLink
      message={m.error_page_locked_account_message()}
      href={UrlBuilder.og.support()}
      target="_blank"
    />
  </p>
</ErrorPage>
