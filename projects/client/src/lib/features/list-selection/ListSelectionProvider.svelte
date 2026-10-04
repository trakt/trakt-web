<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import type { Snippet } from "svelte";
  import { createListSelectionContext } from "./_internal/createListSelectionContext.svelte.ts";

  const { children }: { children: Snippet } = $props();

  iffy(createListSelectionContext);
</script>

{@render children()}
