<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ErrorPage from "$lib/pages/errors/ErrorPage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";

  onMount(() => {
    globalThis.window.history.replaceState(
      null,
      "",
      globalThis.window.location.pathname,
    );
  });
</script>

{#snippet mark()}
  <LockIcon />
{/snippet}

{#snippet actions()}
  <Button
    variant="primary"
    color="purple"
    style="outline"
    href={UrlBuilder.app.ios()}
    target="_blank"
    label={m.link_label_ios_app()}
  >
    {m.link_label_ios_app()}
  </Button>
  <Button
    variant="primary"
    color="purple"
    style="outline"
    href={UrlBuilder.app.android()}
    target="_blank"
    label={m.link_label_android_app()}
  >
    {m.link_label_android_app()}
  </Button>
{/snippet}

<ErrorPage
  title={m.page_title_app_sign_in_handoff()}
  kicker={m.error_kicker_app_sign_in_handoff()}
  message={m.text_app_sign_in_handoff()}
  {mark}
  {actions}
/>
