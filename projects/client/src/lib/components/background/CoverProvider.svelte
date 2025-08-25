<script lang="ts">
  import { useCover } from "./_internal/useCover";

  const { children }: ChildrenProps = $props();

  useCover();
</script>

{@render children()}
