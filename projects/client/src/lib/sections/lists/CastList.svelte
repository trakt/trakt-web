<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { CastMember } from "$lib/requests/models/MediaCrew";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import CastMemberItem from "./components/CastMemberItem.svelte";

  type CastListProps = {
    title: string;
    cast: CastMember[];
    slug: string;
    type: MediaType;
  };

  const { title, cast, slug, type }: CastListProps = $props();
</script>

<SectionList
  id={`cast-list-${slug}`}
  items={cast}
  {title}
  --height-list="var(--height-person-list)"
>
  {#snippet item(castMember)}
    <CastMemberItem {castMember} {type} />
  {/snippet}
</SectionList>
