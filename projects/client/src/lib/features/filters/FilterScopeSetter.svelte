<script lang="ts">
  import { page } from "$app/state";
  import { onDestroy, untrack, type Snippet } from "svelte";
  import { getSnapshotFilters } from "./_internal/getSnapshotFilters.ts";
  import {
    acquireFilterScope,
    releaseFilterScope,
  } from "./filterScopeStore.ts";
  import type { FilterScope } from "./models/FilterScope.ts";

  const {
    filterScope = "local",
    children,
  }: { filterScope?: FilterScope; children: Snippet } = $props();

  // Snapshot captured once at mount; later URL filter edits stay local and do
  // not mutate the scope (that is what keeps outbound links on the snapshot).
  const scope = untrack(() =>
    acquireFilterScope(
      filterScope === "local"
        ? getSnapshotFilters(page.url.searchParams)
        : null,
    ),
  );

  onDestroy(() => releaseFilterScope(scope));
</script>

{@render children()}
