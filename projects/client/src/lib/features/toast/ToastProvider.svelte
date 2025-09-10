<script lang="ts">
  import {} from "svelte";
  import { createToastContext } from "./_internal/createToastContext";

  const { children }: ChildrenProps = $props();

  createToastContext();
</script>

{@render children()}
