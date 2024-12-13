<script lang="ts">
  import { useCover } from "./useCover";

  const { children }: ChildrenProps = $props();

  useCover();
</script>

{@render children()}
