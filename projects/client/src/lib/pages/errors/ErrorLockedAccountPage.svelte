<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.page_title_account_locked()}>
  <p>
    <MessageWithLink
      message={m.error_text_locked_account()}
      href={UrlBuilder.og.support()}
      target="_blank"
    />
  </p>
</ErrorPage>
