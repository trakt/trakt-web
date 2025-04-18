<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import { onMount } from "svelte";
  import { initializeNavigation } from "./useNavigation";

  type NavigationProviderProps = {
    device: DeviceType;
  } & ChildrenProps;

  const { children, device }: NavigationProviderProps = $props();

  const { controller, redirect } = $derived(initializeNavigation(device));

  onMount(() => {
    if (!controller) {
      return;
    }

    redirect();
  });
</script>

{#if controller}
  <div use:controller>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
