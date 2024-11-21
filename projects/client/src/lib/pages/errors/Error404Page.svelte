<script>
  import * as m from "$lib/features/i18n/messages";
  import ErrorPage from "./ErrorPage.svelte";
</script>

<ErrorPage title={m.error_404_title()} message={m.error_404_message()}>
  <a href="/">{m.error_404_action()}.</a>
</ErrorPage>
