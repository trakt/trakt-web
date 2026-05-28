<script lang="ts">
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import DiscoverToggles from "../discover/DiscoverToggles.svelte";
  import type { NavbarStateSetterProps } from "./models/NavbarStateSetterProps";
  import NavbarStateSetter from "./NavbarStateSetter.svelte";

  const { actions: _externalActions, ...rest }: NavbarStateSetterProps =
    $props();

  const isDesktop = useMedia(WellKnownMediaQuery.desktop);
  const hasActions = $derived($isDesktop || Boolean(_externalActions));
</script>

{#snippet actions()}
  {@render _externalActions?.()}

  {#if $isDesktop}
    <DiscoverToggles />
  {/if}
{/snippet}

<NavbarStateSetter actions={hasActions ? actions : undefined} {...rest} />
