<script lang="ts">
  import type { AudienceProps } from "./_internal/AudienceProps";
  import type { DeviceProps } from "./_internal/DeviceProps";
  import RenderForAudience from "./_internal/RenderForAudience.svelte";
  import RenderForDevice from "./_internal/RenderForDevice.svelte";

  type RenderForProps =
    | (ChildrenProps & AudienceProps & DeviceProps)
    | (ChildrenProps & Partial<DeviceProps> & AudienceProps);

  const { children, audience, device }: RenderForProps = $props();
</script>

<RenderForAudience {audience}>
  {#if device}
    <RenderForDevice {device}>
      {@render children()}
    </RenderForDevice>
  {:else}
    {@render children()}
  {/if}
</RenderForAudience>
