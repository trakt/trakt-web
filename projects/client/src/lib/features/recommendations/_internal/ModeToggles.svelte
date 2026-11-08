<script lang="ts" generics="T extends string">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { ModeTogglesProps } from "./ModeTogglesProps";

  const { flag, value, options, onChange }: ModeTogglesProps<T> = $props();
</script>

<RenderForFeature {flag} audience="director">
  {#snippet enabled()}
    <Toggler {value} {onChange} {options} />
  {/snippet}
</RenderForFeature>
