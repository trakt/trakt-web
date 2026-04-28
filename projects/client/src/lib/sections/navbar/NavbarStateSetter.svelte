<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { useNavbarState, type NavbarMode } from "./useNavbarState";

  const {
    actions,
    contextualActions,
    toastActions,
    mode,
    hasFilters,
    showFilters,
    headerActions,
    header,
  }: {
    actions?: Snippet;
    contextualActions?: Snippet;
    toastActions?: Snippet | Nil;
    mode?: NavbarMode;
    hasFilters?: boolean;
    showFilters?: boolean;
    headerActions?: Snippet;
    header?: {
      title: string;
      metaInfo?: string | Snippet;
      actions?: Snippet;
    };
  } = $props();

  const { set, globalSet, reset } = useNavbarState();

  $effect(() => {
    set({
      actions,
      contextualActions,
      hasFilters,
      showFilters,
      headerActions,
      header,
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
