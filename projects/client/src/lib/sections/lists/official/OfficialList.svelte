<script lang="ts">
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia";
  import MediaCard from "../components/MediaCard.svelte";
  import { useOfficialList } from "./useOfficialList";

  type OfficialListProps = {
    title: string;
    listId: string;
    type?: MediaType;
  };

  const { title, listId, type }: OfficialListProps = $props();

  const { list } = $derived(useOfficialList({ listId, type }));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const style = $derived($isMobile ? "summary" : "cover");
</script>

<!-- TODO use drilled media list & fetch rest on scroll -->
<GridList
  id={`official-list-${listId}`}
  {title}
  items={$list}
  --width-item="var(--width-poster-card)"
>
  {#snippet item(media)}
    <MediaCard type={media.type} {media} {style} />
  {/snippet}
</GridList>
