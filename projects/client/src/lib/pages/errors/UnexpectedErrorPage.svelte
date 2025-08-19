<script>
  import Button from "$lib/components/buttons/Button.svelte";
  import MessageWithLink from "$lib/components/link/MessageWithLink.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.page_title_unexpected_error()}>
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
</ErrorPage>
