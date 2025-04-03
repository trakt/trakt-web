<script>
  import Button from "$lib/components/buttons/Button.svelte";
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage
  title={m.error_page_service_title()}
  message={m.error_page_service_message()}
>
  <Link href={UrlBuilder.og.status()} color="classic">
    {m.error_page_service_status()}
  </Link>
  <Button
    variant="primary"
    color="purple"
    onclick={() => window.location.reload()}
    label={m.retry()}
  >
    {m.retry()}
  </Button>
</ErrorPage>
