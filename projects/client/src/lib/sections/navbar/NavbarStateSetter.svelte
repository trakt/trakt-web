<script lang="ts">
  import { onMount, type Snippet } from "svelte";
  import { useNavbarState, type NavbarMode } from "./useNavbarState";

  const {
    actions,
    seasonalActions,
    contextualActions,
    mode,
  }: {
    actions?: Snippet;
    seasonalActions?: Snippet;
    /**
     * FIXME: for now the contextual actions only set the mobile navbar's contextual actions.
     * In case of desktop, this should trigger the toast instead.
     */
    contextualActions?: Snippet;
    mode?: NavbarMode;
  } = $props();

  const { set, reset } = useNavbarState();

  onMount(() => {
    set({
      actions,
      seasonalActions,
      contextualActions,
      mode,
    });

    return () => {
      reset();
    };
  });
</script>
