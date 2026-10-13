<script lang="ts">
  import EasterEggGamePage from "$lib/features/easter-egg/EasterEggGamePage.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import Error404Page from "$lib/pages/errors/Error404Page.svelte";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import { DEFAULT_SHARE_COVER } from "$lib/utils/assets";

  const webview = useWebviewSession();
</script>

{#if webview.isStandalone}
  <TraktPage
    audience="all"
    image={DEFAULT_SHARE_COVER}
    title={m.header_game_rated_higher()}
    mode="content-only"
  >
    <NavbarStateSetter mode="hidden" />
    <EasterEggGamePage />
  </TraktPage>
{:else}
  <Error404Page />
{/if}
