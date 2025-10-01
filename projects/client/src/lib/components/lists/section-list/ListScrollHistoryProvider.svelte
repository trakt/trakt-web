<script lang="ts">
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import { debounce } from "$lib/utils/timing/debounce";
  import { time } from "$lib/utils/timing/time";
  import { useScrollHistory } from "../_internal/useScrollHistory";

  const { children }: ChildrenProps = $props();

  const { event } = useScrollHistory();

  beforeNavigate((nav) => {
    const isNavigationToAnotherPage =
      ["link", "goto"].includes(nav.type) && nav.willUnload === false;

    isNavigationToAnotherPage && event.emit("snapshot", undefined);
  });

  const debouncedEmit = debounce(
    (isHistoryNavigation: boolean) =>
      isHistoryNavigation && event.emit("restore", undefined),
    time.fps(30),
  );

  afterNavigate((nav) => {
    const isHistoryNavigation =
      nav.type === "popstate" && nav.willUnload === false;

    // FIXME: see if we can do this without the debounce
    debouncedEmit(isHistoryNavigation);
  });
</script>

{@render children()}
