<script lang="ts">
  import { page } from "$app/state";
  import {} from "svelte";
  import { createSearchContext } from "./_internal/createSearchContext";

  const { children }: ChildrenProps = $props();

  const { mode, pathName, exitPathName, query } = createSearchContext();

  function toSearchMode(value: string | null) {
    switch (value) {
      case "people":
        return "people";
      case "media":
        return "media";
      default:
        return $mode;
    }
  }

  $effect(() => {
    if (!page.url.pathname.startsWith(pathName)) {
      exitPathName.set(page.url.pathname);
    }
  });

  $effect(() => {
    const m = page.url.searchParams.get("m");
    mode.set(toSearchMode(m));

    if (!page.url.searchParams.has("q")) {
      return;
    }

    const q = page.url.searchParams.get("q");
    if (!q?.trim()) {
      return;
    }

    query.set(q);
  });
</script>

{@render children()}
