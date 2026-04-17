<script lang="ts">
  import { afterNavigate } from "$app/navigation";
  import { createNavigationHistoryContext } from "./_internal/createNavigationHistoryContext.ts";

  const { children }: ChildrenProps = $props();

  const { internalNavigations } = createNavigationHistoryContext();

  afterNavigate((nav) => {
    if (nav.from == null) return;

    if (nav.type === "popstate" && nav.delta < 0) {
      internalNavigations.next(Math.max(0, internalNavigations.value - 1));
      return;
    }

    internalNavigations.next(internalNavigations.value + 1);
  });
</script>

{@render children()}
