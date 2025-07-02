<script>
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.page_title_error_404()}>
  <p>{m.error_text_404()}</p>
  <Link href={UrlBuilder.home()} color="classic">
    {m.link_text_back_to_safety()}
  </Link>
</ErrorPage>
