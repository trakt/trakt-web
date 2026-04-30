<script lang="ts">
  import { createEditModeContext } from "./_internal/createEditModeContext";

  const { children }: ChildrenProps = $props();

  createEditModeContext();
</script>

{@render children()}
