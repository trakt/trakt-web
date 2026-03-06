<script lang="ts">
  import type { MovieContinueEntry } from "$lib/requests/models/MovieProgressEntry";
  import type { UpNextContinueEntry } from "$lib/requests/models/UpNextEntry";
  import UpNextItem from "./UpNextItem.svelte";
  import { useHiddenShows } from "./useHiddenShows";

  const {
    entry,
    style,
  }: {
    entry: UpNextContinueEntry | MovieContinueEntry;
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
      : { movie: entry, playbackId: entry.playbackId },
  );
</script>

<UpNextItem {style} {...target} />
