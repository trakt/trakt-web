<script lang="ts">
  import { page } from "$app/state";
  import {
    crewPositionSchema,
    type CrewPosition,
  } from "$lib/requests/models/CrewPosition";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { useCreditsList } from "../stores/useCreditsList";
  import CreditsPositionDropdown from "./CreditsPositionDropdown.svelte";

  type CreditsPositionSelectorProps = {
    slug: string;
    type: MediaType;
  };

  const { slug, type }: CreditsPositionSelectorProps = $props();

  const selectedPosition = $derived<CrewPosition>(
    crewPositionSchema.safeParse(
      page.url.searchParams.get(`${type}s`)?.toLowerCase(),
    ).data ?? "acting",
  );

  const { positions: allPositions } = $derived(useCreditsList({ type, slug }));

  const buildPositionHref = (position: CrewPosition) => {
    const url = new URL(page.url.toString());
    url.searchParams.set(`${type}s`, position);
    return url.toString();
  };
</script>

<CreditsPositionDropdown
  {selectedPosition}
  allPositions={$allPositions}
  {buildPositionHref}
/>
