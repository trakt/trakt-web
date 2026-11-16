<script lang="ts">
  import { useIsMe } from "$lib/features/auth/stores/useIsMe";
  import { useWebviewSession } from "$lib/features/webview/useWebviewSession";
  import TraktPage from "$lib/sections/layout/TraktPage.svelte";
  import TraktPageCoverSetter from "$lib/sections/layout/TraktPageCoverSetter.svelte";
  import NavbarStateSetter from "$lib/sections/navbar/NavbarStateSetter.svelte";
  import type { Snippet } from "svelte";

  const {
    user,
    title,
    image,
    children,
  }: {
    /** Profile slug the review belongs to; drives the "me" audience. */
    user: string;
    title: string;
    image?: string | Nil;
    children: Snippet;
  } = $props();

  const { isMe } = $derived(useIsMe(user));
  const audience = $derived($isMe ? "authenticated" : "all");

  // Standalone WebView mode drops the app chrome so the page reads as a native
  // screen; otherwise keep the minimal navbar.
  const webview = useWebviewSession();
  const navbarMode = $derived(webview.isStandalone ? "hidden" : "minimal");
</script>

<TraktPage {audience} {image} {title} mode="content-only">
  <NavbarStateSetter mode={navbarMode} sidebar={{ mode: "fixed" }} />

  <TraktPageCoverSetter />

  {@render children()}
</TraktPage>
