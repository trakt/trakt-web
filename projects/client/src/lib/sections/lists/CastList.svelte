<script lang="ts">
  import SectionList from "$lib/components/section-list/SectionList.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import CastMemberItem from "./components/CastMemberItem.svelte";
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
  spacing="large"
  {title}
  --height-list={mediaListHeightResolver("person")}
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} />
  {/snippet}
</SectionList>
