<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ErrorPage from "$lib/pages/errors/ErrorPage.svelte";
  import { extractOS } from "$lib/utils/devices/extractOS.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import { buildAppCallbackIntent } from "./_internal/buildAppCallbackIntent.ts";

  let appIntent = $state<string | null>(null);

  onMount(() => {
    if (extractOS(globalThis.navigator.userAgent) === "android") {
      appIntent = buildAppCallbackIntent(
        new URL(globalThis.window.location.href),
        UrlBuilder.app.android(),
      );
    }

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
  {#if appIntent}
    {@const intent = appIntent}
    <Button
      variant="primary"
      color="purple"
      onclick={() => globalThis.window.location.assign(intent)}
      label={m.button_text_open_in_service({ service: "Trakt" })}
    >
      {m.button_text_open_in_service({ service: "Trakt" })}
    </Button>
  {/if}
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
  message={appIntent
    ? m.text_app_sign_in_handoff_open_app()
    : m.text_app_sign_in_handoff()}
  {mark}
  {actions}
/>
