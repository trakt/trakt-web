<script lang="ts">
  import { page } from "$app/state";
  import {} from "svelte";
  import { createSearchContext } from "./_internal/createSearchContext";
  import { toSearchTarget } from "./_internal/toSearchTarget";

  const { children }: ChildrenProps = $props();

  const initialTarget = toSearchTarget(
    page.url.searchParams.get("m"),
    page.url.searchParams.get("t"),
  );

  const { mode, mediaType, pathName, exitPathName, query } =
    createSearchContext(initialTarget);

  $effect(() => {
    if (!page.url.pathname.startsWith(pathName)) {
      exitPathName.set(page.url.pathname);
    }
  });

  $effect(() => {
    const m = page.url.searchParams.get("m");
    const t = page.url.searchParams.get("t");
    const target = toSearchTarget(m, t);

    const newMode = target.mode ?? $mode;
    mode.set(newMode);

    newMode === "media" && mediaType.set(target.mediaType);

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
