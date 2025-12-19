<script lang="ts">
  import { page } from "$app/state";
  import { iffy } from "$lib/utils/function/iffy";
  import {} from "svelte";
  import { createSearchContext } from "./_internal/createSearchContext";
  import { toSearchTarget } from "./_internal/toSearchTarget";

  const { children, config }: ChildrenProps & { config: TypesenseConfig } =
    $props();

  const initialTarget = toSearchTarget(page.url.searchParams.get("m"));
  const { mode, query } = iffy(() =>
    createSearchContext({
      ...initialTarget,
      config,
    }),
  );

  $effect(() => {
    const m = page.url.searchParams.get("m");
    const target = toSearchTarget(m);

    const newMode = target.mode ?? $mode;
    mode.next(newMode);

    if (!page.url.searchParams.has("q")) {
      return;
    }

    const q = page.url.searchParams.get("q");
    if (!q?.trim()) {
      query.next("");
      return;
    }

    query.next(q);
  });
</script>

{@render children()}
