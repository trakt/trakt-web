<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import CastMemberItem from "./components/CastMemberItem.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    slug: string;
  };

  const { title, cast, slug }: CastListProps = $props();
</script>

<SectionList
  id={`cast-list-${slug}`}
  items={cast}
  {title}
  --height-list={mediaListHeightResolver("person")}
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} />
  {/snippet}
</SectionList>
