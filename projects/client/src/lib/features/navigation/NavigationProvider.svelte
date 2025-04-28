<script lang="ts">
  import type { DeviceType } from "$lib/models/DeviceType";
  import { initializeNavigation } from "./useNavigation";

  type NavigationProviderProps = {
    device: DeviceType;
  } & ChildrenProps;

  const { children, device }: NavigationProviderProps = $props();

  const { controller } = $derived(initializeNavigation(device));
</script>

{#if controller}
  <div use:controller>
    {@render children()}
  </div>
{:else}
  {@render children()}
{/if}
