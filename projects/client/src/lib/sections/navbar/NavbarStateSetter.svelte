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
  }: {
    actions?: Snippet;
    seasonalActions?: Snippet;
    contextualActions?: Snippet;
    toastActions?: Snippet | Nil;
    mode?: NavbarMode;
    hasFilters?: boolean;
  } = $props();

  const { set, globalSet, reset } = useNavbarState();

  $effect(() => {
    set({
      actions,
      seasonalActions,
      contextualActions,
      hasFilters,
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
