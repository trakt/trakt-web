<script>
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.error_404_title()} message={m.error_404_message()}>
  <Link href={UrlBuilder.home()} color="classic">
    {m.error_404_action()}
  </Link>
</ErrorPage>
