<script lang="ts">
  import { useFilter } from "./useFilter";

  const { children }: ChildrenProps = $props();

  useFilter();
</script>

{@render children()}
