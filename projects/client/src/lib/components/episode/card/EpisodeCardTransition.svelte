<script lang="ts">
  import { linear } from "svelte/easing";
  import { fade } from "svelte/transition";

  const { children }: ChildrenProps = $props();
</script>

<div transition:fade={{ duration: 250, easing: linear }}>
  {@render children()}
</div>
