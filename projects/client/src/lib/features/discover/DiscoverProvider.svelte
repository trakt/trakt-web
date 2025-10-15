<script lang="ts">
  import { useToggler } from "$lib/components/toggles/useToggler";
  import { DISCOVER_ROUTES } from "./_internal/constants";
  import { createDiscoverContext } from "./_internal/createDiscoverContext";

  const { children }: ChildrenProps = $props();

  const { current } = useToggler("discover");

  createDiscoverContext($current.value, DISCOVER_ROUTES);
</script>

{@render children()}
