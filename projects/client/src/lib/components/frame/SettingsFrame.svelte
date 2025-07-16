<script lang="ts">
  import { useUser } from "$lib/features/auth/stores/useUser";
  import { getToken } from "$lib/features/auth/token";
  import * as m from "$lib/features/i18n/messages.ts";
  import LoadingIndicator from "$lib/sections/lists/drilldown/_internal/LoadingIndicator.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { writable } from "svelte/store";
  import { frameListener } from "./_internal/frameListener";

  const { user } = useUser();
  const { value: token } = getToken();

  const isLoading = writable(true);

  function handleLoad() {
    isLoading.set(false);
  }
</script>

<div class="trakt-settings-frame-container" class:is-loading={$isLoading}>
  <LoadingIndicator />

  <iframe
    class="trakt-settings-frame"
    title={m.page_title_settings()}
    src={UrlBuilder.og.frame.settings(token ?? "")}
    use:frameListener={$user.slug}
    onload={handleLoad}
  ></iframe>
</div>

<style>
  .trakt-settings-frame-container {
    position: relative;
    width: 100%;
    height: fit-content;
    min-height: var(--ni-480);

    :global(.loading-indicator) {
      display: none;
    }
  }

  iframe {
    width: 100%;
    height: var(--ni-480);
    border: none;
    overflow: hidden;
    transition: opacity var(--transition-increment) ease-in-out;
  }

  .trakt-settings-frame-container.is-loading {
    display: flex;
    justify-content: center;
    align-items: center;

    iframe {
      display: none;
    }

    :global(.loading-indicator) {
      display: initial;
    }
  }
</style>
