<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import LockIcon from "$lib/components/icons/LockIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import ErrorPage from "$lib/pages/errors/ErrorPage.svelte";
  import { extractOS } from "$lib/utils/devices/extractOS.ts";
  import { isMobileAppleDevice } from "$lib/utils/devices/isMobileAppleDevice.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { onMount } from "svelte";
  import { buildAppCallbackDeepLink } from "./_internal/buildAppCallbackDeepLink.ts";
  import { buildAppCallbackIntent } from "./_internal/buildAppCallbackIntent.ts";

  type HandoffPlatform = "android" | "ios" | "other";

  let platform = $state<HandoffPlatform>("other");
  let appLink = $state<string | null>(null);

  function detectPlatform(): HandoffPlatform {
    if (extractOS(globalThis.navigator.userAgent) === "android") {
      return "android";
    }

    return isMobileAppleDevice() ? "ios" : "other";
  }

  function buildAppLink(callbackUrl: URL): string | null {
    switch (platform) {
      case "android":
        return buildAppCallbackIntent(callbackUrl, UrlBuilder.app.android());
      case "ios":
        return buildAppCallbackDeepLink(callbackUrl);
      default:
        return null;
    }
  }

  onMount(() => {
    platform = detectPlatform();
    appLink = buildAppLink(new URL(globalThis.window.location.href));

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
  {#if appLink}
    {@const link = appLink}
    <Button
      variant="primary"
      color="purple"
      onclick={() => globalThis.window.location.assign(link)}
      label={m.button_text_open_in_service({ service: "Trakt" })}
    >
      {m.button_text_open_in_service({ service: "Trakt" })}
    </Button>
  {:else}
    {#if platform !== "android"}
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
    {/if}
    {#if platform !== "ios"}
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
    {/if}
  {/if}
{/snippet}

<ErrorPage
  title={m.page_title_app_sign_in_handoff()}
  kicker={m.error_kicker_app_sign_in_handoff()}
  message={appLink
    ? m.text_app_sign_in_handoff_open_app()
    : m.text_app_sign_in_handoff()}
  {mark}
  {actions}
/>
