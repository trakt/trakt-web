<script lang="ts">
  import { createFeatureFlagContext } from "./_internal/createFeatureFlagContext";

  const { children }: ChildrenProps = $props();

  createFeatureFlagContext();
</script>

{@render children()}
