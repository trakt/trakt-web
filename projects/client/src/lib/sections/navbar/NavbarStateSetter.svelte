<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { useNavbarState, type NavbarMode } from "./useNavbarState";

  const {
    actions,
    seasonalActions,
    contextualActions,
    toastActions,
    mode,
    hasFilters,
    sortActions,
  }: {
    actions?: Snippet;
    seasonalActions?: Snippet;
    contextualActions?: Snippet;
    toastActions?: Snippet | Nil;
    mode?: NavbarMode;
    hasFilters?: boolean;
    sortActions?: Snippet;
  } = $props();

  const { set, globalSet, reset } = useNavbarState();

  $effect(() => {
    set({
      actions,
      seasonalActions,
      contextualActions,
      hasFilters,
      sortActions,
    });
  });

  $effect(() => {
    globalSet({
      ...(toastActions !== undefined && { toastActions }),
      ...(mode !== undefined && { mode }),
    });
  });

  onMount(() => {
    return () => {
      reset();
    };
  });
</script>
