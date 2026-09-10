<script lang="ts">
  import { page } from "$app/state";
  import { useAuth } from "$lib/features/auth/stores/useAuth";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { iffy } from "$lib/utils/function/iffy";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import { shortcut } from "@svelte-put/shortcut";
  import { createSpotlightContext } from "./_internal/createSpotlightContext";
  import { createSpotlightTriggers } from "./_internal/createSpotlightTriggers";
  import SpotlightOverlay from "./_internal/SpotlightOverlay.svelte";

  const { children }: ChildrenProps = $props();

  const { isAuthorized } = useAuth();
  const { open, toggle } = iffy(createSpotlightContext);

  const excludedRoutes = new Set([UrlBuilder.welcome()]);

  const triggers = $derived(createSpotlightTriggers({
    enabled: $isAuthorized && !excludedRoutes.has(page.url.pathname),
    open,
    toggle,
  }));
</script>

<svelte:window use:shortcut={{ trigger: triggers }} />

{@render children()}

<RenderFor audience="authenticated">
  <SpotlightOverlay />
</RenderFor>
