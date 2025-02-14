<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import MediaCard from "./components/MediaCard.svelte";
  import { useCreditsList } from "./stores/useCreditsList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CreditsListProps = {
    title: string;
    type: MediaType;
    person: PersonSummary;
  };

  const { title, type, person }: CreditsListProps = $props();

  const { credits } = useCreditsList({
    type,
    slug: person.slug,
  });

  const getPositionList = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];

    if (!person.knownFor || person.knownFor === "acting") {
      return mediaCredits.cast ?? [];
    }

    return mediaCredits.crew?.get(person.knownFor) ?? [];
  };

  const list = $derived(getPositionList($credits));
</script>

<SectionList
  id={`credits-list-${type}`}
  items={list}
  {title}
  --height-list={mediaListHeightResolver(type)}
>
  {#snippet item(media)}
    <MediaCard {type} {media} />
  {/snippet}
</SectionList>
