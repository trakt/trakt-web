<script>
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.page_title_service_unavailable()}>
  <p>{m.error_text_service_unavailable()}</p>
  <Link href={UrlBuilder.og.status()} color="classic">
    {m.link_text_service_status()}
  </Link>
  <Button
    variant="primary"
    color="purple"
    onclick={() => window.location.reload()}
    label={m.button_label_retry()}
  >
    {m.button_text_retry()}
  </Button>
</ErrorPage>
