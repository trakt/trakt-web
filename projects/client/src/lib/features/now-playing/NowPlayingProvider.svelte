<script lang="ts">
  import {} from "svelte";
  import { createNowPlayingContext } from "./_internal/createNowPlayingContext";

  const { children }: ChildrenProps = $props();

  createNowPlayingContext();
</script>

{@render children()}
