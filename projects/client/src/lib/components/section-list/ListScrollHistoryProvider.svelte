<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { useScrollHistory } from "./useScrollHistory";

  const { children }: ChildrenProps = $props();

  const { event } = useScrollHistory();

  beforeNavigate((nav) => {
    const isNavigationToAnotherPage =
      nav.type === "goto" && nav.willUnload === false;

    isNavigationToAnotherPage && event.emit("snapshot", void 0);
  });

  afterNavigate((nav) => {
    const isHistoryNavigation =
      nav.type === "popstate" && nav.willUnload === false;

    isHistoryNavigation && event.emit("restore", void 0);
  });
</script>

{@render children()}
