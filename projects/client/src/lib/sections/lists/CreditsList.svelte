<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import MediaCard from "./components/MediaCard.svelte";
  import { useCreditsList } from "./stores/useCreditsList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CreditsListProps = {
    title: string;
    type: MediaType;
    slug: string;
  };

  const { title, type, slug }: CreditsListProps = $props();

  const { list } = useCreditsList({ type, slug });
</script>

<SectionList
  id={`credits-list-${type}`}
  items={$list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaCard {type} {media} />
  {/snippet}
</SectionList>
