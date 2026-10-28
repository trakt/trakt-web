<script lang="ts">
  import { onMount } from "svelte";
  import type { NavbarStateSetterProps } from "./models/NavbarStateSetterProps";
  import { useNavbarState } from "./useNavbarState";

  const {
    actions,
    contextualActions,
    contentToggle,
    toastActions,
    mode,
    entry,
    hasFilters,
    showFilters,
    smartListTarget,
    headerActions,
    header,
    sidebar,
  }: NavbarStateSetterProps = $props();

  const { set, globalSet, reset } = useNavbarState();

  $effect(() => {
    set({
      actions,
      contextualActions,
      contentToggle,
      hasFilters,
      showFilters,
      smartListTarget,
      headerActions,
      header,
      sidebar,
    });
  });

  $effect(() => {
    globalSet({
      ...(toastActions !== undefined && { toastActions }),
      ...(mode !== undefined && { mode }),
      ...(entry !== undefined && { entry }),
    });
  });

  onMount(() => {
    return () => {
      reset();
    };
  });
</script>
