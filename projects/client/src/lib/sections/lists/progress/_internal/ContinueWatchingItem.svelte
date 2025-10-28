<script lang="ts">
  import { type ProgressEntry } from "../useUpNextList";
  import UpNextItem from "./UpNextItem.svelte";
  import { useHiddenShows } from "./useHiddenShows";

  const {
    entry,
    style,
  }: {
    entry: ProgressEntry;
    style: "summary" | "cover";
  } = $props();

  const { list: hidden } = $derived(useHiddenShows());

  const target = $derived(
    "show" in entry
      ? {
          episode: entry,
          show: entry.show,
          status: $hidden.includes(entry.show.id)
            ? ("hidden" as const)
            : ("watching" as const),
        }
      : { movie: entry },
  );
</script>

<UpNextItem {style} {...target} />
