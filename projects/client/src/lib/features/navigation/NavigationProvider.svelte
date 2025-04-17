<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import { onMount } from "svelte";
  import { useNavigation } from "./useNavigation";

  type NavigationProviderProps = {
    device: DeviceType;
  } & ChildrenProps;

  const { children, device }: NavigationProviderProps = $props();

  const { controller, redirect } = $derived(useNavigation(device));

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
