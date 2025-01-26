<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import CastMemberCard from "./components/CastMemberCard.svelte";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CastListProps = {
    title: string;
    cast: CastMember[];
  };

  const { title, cast }: CastListProps = $props();
</script>

<SectionList
  id={`cast-list`}
  items={cast}
  {title}
  --height-list={mediaListHeightResolver("person")}
>
  {#snippet item(castMember)}
    <CastMemberCard {castMember} />
  {/snippet}
</SectionList>
