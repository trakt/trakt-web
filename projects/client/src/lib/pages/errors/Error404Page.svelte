<script>
  import Link from "$lib/components/link/Link.svelte";
  import * as m from "$lib/features/i18n/messages";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.error_404_title()} message={m.error_404_message()}>
  <Link href="/" color="classic">
    {m.error_404_action()}
  </Link>
</ErrorPage>

<style>
</style>
