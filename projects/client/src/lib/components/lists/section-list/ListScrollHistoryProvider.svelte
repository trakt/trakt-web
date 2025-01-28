<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { useScrollHistory } from "../_internal/useScrollHistory";

  const { children }: ChildrenProps = $props();

  const { event } = useScrollHistory();

  beforeNavigate((nav) => {
    const isNavigationToAnotherPage =
      ["link", "goto"].includes(nav.type) && nav.willUnload === false;

    isNavigationToAnotherPage && event.emit("snapshot", undefined);
  });

  afterNavigate((nav) => {
    const isHistoryNavigation =
      nav.type === "popstate" && nav.willUnload === false;

    isHistoryNavigation && event.emit("restore", undefined);
  });
</script>

{@render children()}
