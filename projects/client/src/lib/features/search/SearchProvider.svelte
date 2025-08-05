<script lang="ts">
  import { page } from "$app/state";
  import {} from "svelte";
  import { createSearchContext } from "./_internal/createSearchContext";

  const { children }: ChildrenProps = $props();

  const { pathName, exitPathName, query } = createSearchContext();

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

    query.set(q);
  });
</script>

{@render children()}
