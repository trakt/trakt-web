<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type {
    CrewPosition,
    CrewPositions,
  } from "$lib/requests/models/CrewPosition";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { PersonSummary } from "$lib/requests/models/PersonSummary";
  import { useDefaultCardVariant } from "$lib/stores/useDefaultCardVariant";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder";
  import CreditMediaItem from "./components/CreditMediaItem.svelte";
  import CreditsPositionDropdown from "./components/CreditsPositionDropdown.svelte";
  import { useCreditsList } from "./stores/useCreditsList";
  import { mediaListHeightResolver } from "./utils/mediaListHeightResolver";

  type CreditsListProps = {
    title: string;
    type: MediaType;
    person: PersonSummary;
    positions?: CrewPositions;
    drilldownLink?: string;
  };

  const { title, type, person, positions, drilldownLink }: CreditsListProps =
    $props();

  const selectedPosition = $derived.by(() => {
    const defaultPosition = person.knownFor ?? "acting";
    const position = positions?.[`${type}s`];

    return position ?? defaultPosition;
  });

  const { credits, positions: allPositions } = $derived(
    useCreditsList({ type, slug: person.slug }),
  );

  const getPositionList = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];
    return mediaCredits.get(selectedPosition) ?? [];
  };

  const list = $derived(getPositionList($credits));
  const defaultVariant = $derived(useDefaultCardVariant(type));

  const drilldownHref = $derived(
    drilldownLink ? `${drilldownLink}?${type}s=${selectedPosition}` : undefined,
  );

  const buildPositionHref = (position: CrewPosition) => {
    const params = positions ?? {};
    return UrlBuilder.people(person.slug, {
      ...params,
      [`${type}s`]: position,
    });
  };
</script>

<SectionList
  id={`credits-list-${person.slug}-${type}-${selectedPosition}`}
  items={list}
  {title}
  drilldown={drilldownHref
    ? {
        href: drilldownHref,
        label: m.button_text_view_all(),
        source: { id: "credits" },
      }
    : undefined}
  --height-list={mediaListHeightResolver($defaultVariant)}
>
  {#snippet item(entry)}
    <CreditMediaItem mediaCredit={entry} source="credits" mode="standalone" />
  {/snippet}

  {#snippet actions()}
    <CreditsPositionDropdown
      {selectedPosition}
      allPositions={$allPositions}
      {buildPositionHref}
    />
  {/snippet}
</SectionList>
