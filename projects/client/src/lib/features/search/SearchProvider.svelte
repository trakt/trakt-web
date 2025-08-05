<script lang="ts">
  import { page } from "$app/state";
  import type { SearchMode } from "$lib/requests/queries/search/models/SearchMode";
  import {} from "svelte";
  import { createSearchContext } from "./_internal/createSearchContext";

  const { children }: ChildrenProps = $props();

  const { mode, pathName, exitPathName, query } = createSearchContext();

  function toSearchMode(value: string | null) {
    return (value === "people" ? "people" : "media") as SearchMode;
  }

  $effect(() => {
    if (!page.url.pathname.startsWith(pathName)) {
      exitPathName.set(page.url.pathname);
    }
  });

  $effect(() => {
    if (!page.url.searchParams.has("q")) {
      return;
    }

    const q = page.url.searchParams.get("q");
    if (!q?.trim()) {
      return;
    }

    const m = page.url.searchParams.get("m");
    mode.set(toSearchMode(m));
    query.set(q);
  });
</script>

{@render children()}
