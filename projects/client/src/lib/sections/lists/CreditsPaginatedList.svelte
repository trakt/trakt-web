<script lang="ts">
  import { page } from "$app/state";
  import GridList from "$lib/components/lists/grid-list/GridList.svelte";
  import {
    crewPositionSchema,
    type CrewPosition,
  } from "$lib/requests/models/CrewPosition";
  import type { MediaCredits } from "$lib/requests/models/MediaCredits";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import CreditMediaItem from "./components/CreditMediaItem.svelte";
  import { useCreditsList } from "./stores/useCreditsList";

  type CreditsPaginatedListProps = {
    slug: string;
    type: MediaType;
  };

  const { slug, type }: CreditsPaginatedListProps = $props();

  const selectedPosition = $derived<CrewPosition>(
    crewPositionSchema.safeParse(
      page.url.searchParams.get(`${type}s`)?.toLowerCase(),
    ).data ?? "acting",
  );

  const { credits } = $derived(useCreditsList({ type, slug }));

  const getPositionList = (mediaCredits?: MediaCredits) => {
    if (!mediaCredits) return [];
    return mediaCredits.get(selectedPosition) ?? [];
  };

  const list = $derived(getPositionList($credits));
</script>

<GridList
  id={`credits-list-${slug}-${type}-${selectedPosition}`}
  items={list}
  sizing="auto"
  --width-item="var(--width-summary-card)"
>
  {#snippet item(entry)}
    <CreditMediaItem
      mediaCredit={entry}
      source="credits"
      mode="standalone"
      style="summary"
    />
  {/snippet}
</GridList>
