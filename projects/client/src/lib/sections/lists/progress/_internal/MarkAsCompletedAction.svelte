<script lang="ts">
  import MarkAsWatchedButton from "$lib/components/buttons/mark-as-watched/MarkAsWatchedButton.svelte";
  import type { MovieEntry } from "$lib/requests/models/MovieEntry";
  import { useDrop } from "$lib/sections/media-actions/drop/useDrop";
  import { useMarkAsWatched } from "$lib/sections/media-actions/mark-as-watched/useMarkAsWatched";
  import { NOOP_FN } from "$lib/utils/constants";

  const {
    media,
    playbackId,
    style = "action",
    size = "normal",
  }: {
    media: MovieEntry;
    playbackId: number;
    style: "normal" | "action" | "dropdown-item";
    size?: "normal" | "small";
  } = $props();

  const { isMarkingAsWatched, markAsWatched } = $derived(
    useMarkAsWatched({
      type: media.type,
      media,
    }),
  );

  const { drop, isDropping } = $derived(
    useDrop({
      id: playbackId,
      type: media.type,
    }),
  );

  const isMarkingOrDropping = $derived($isMarkingAsWatched || $isDropping);

  const handler = $derived(() => {
    drop();
    markAsWatched();
  });
</script>

<MarkAsWatchedButton
  {style}
  {size}
  mode="act"
  title={media.title}
  isWatched={false}
  isMarkingAsWatched={isMarkingOrDropping}
  onWatch={handler}
  onRemove={NOOP_FN}
  onAsk={NOOP_FN}
/>
