<script>
  import * as m from "$lib/features/i18n/messages.ts";

  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";

  const { user } = useUser();
</script>

<ErrorPage title={m.page_title_account_locked()}>
  <p>
    <MessageWithLink
      message={m.error_page_locked_account_message()}
      href={UrlBuilder.og.support($user.slug)}
      target="_blank"
    />
  </p>
</ErrorPage>
