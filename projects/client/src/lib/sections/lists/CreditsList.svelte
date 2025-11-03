<script lang="ts">
  import DropdownItem from "$lib/components/dropdown/DropdownItem.svelte";
  import DropdownList from "$lib/components/dropdown/DropdownList.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { CrewPosition } from "$lib/requests/models/CrewPosition";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { toTranslatedValue } from "$lib/utils/formatting/string/toTranslatedValue";
  import { writable } from "svelte/store";
  import DefaultMediaItem from "./components/DefaultMediaItem.svelte";
  import { useCreditsList } from "./stores/useCreditsList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CreditsListProps = {
    title: string;
    type: MediaType;
    person: PersonSummary;
  };

  const { title, type, person }: CreditsListProps = $props();

  const currentPosition = writable<CrewPosition>(person.knownFor ?? "acting");

  const { credits } = $derived(useCreditsList({ type, slug: person.slug }));

  const getPositionList = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];

    const mediaList =
      $currentPosition === "acting"
        ? mediaCredits.cast
        : mediaCredits.crew?.get($currentPosition);

    return mediaList ?? [];
  };

  const getAvailablePositions = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];

    const positions = Array.from(mediaCredits.crew?.keys() ?? []);
    if (mediaCredits.cast?.length) {
      positions.unshift("acting");
    }

    return positions;
  };

  const positions = $derived(getAvailablePositions($credits));
  const list = $derived(getPositionList($credits));
  const defaultVariant = $derived(useDefaultCardVariant(type));
</script>

<SectionList
  id={`credits-list-${person.slug}-${type}-${$currentPosition}`}
  items={list}
  {title}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(media)}
    <DefaultMediaItem {type} {media} source="credits" />
  {/snippet}

  {#snippet dynamicActions()}
    <DropdownList
      label={m.dropdown_label_person_position()}
      preferNative
      style="flat"
      variant="primary"
      color="blue"
      text="capitalize"
      size="small"
      disabled={positions.length <= 1}
    >
      {toTranslatedValue("position", $currentPosition)}
      {#snippet items()}
        {#each positions as position}
          <DropdownItem
            color="blue"
            onclick={() => currentPosition.set(position)}
          >
            {toTranslatedValue("position", position)}
          </DropdownItem>
        {/each}
      {/snippet}
    </DropdownList>
  {/snippet}
</SectionList>
