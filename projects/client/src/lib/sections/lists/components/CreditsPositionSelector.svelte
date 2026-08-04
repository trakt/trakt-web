<script lang="ts">
  import { page } from "$app/state";
  import { useDiscover } from "$lib/features/filters/useDiscover";
  import { useFilter } from "$lib/features/filters/useFilter";
  import type { CrewPosition } from "$lib/requests/models/CrewPosition";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import { fromRune } from "$lib/utils/store/fromRune.svelte";
  import { useCreditsList } from "../stores/useCreditsList";
  import { parseRequestedPosition } from "../utils/parseRequestedPosition";
  import { resolveSelectedPosition } from "../utils/resolveSelectedPosition";
  import CreditsPositionDropdown from "./CreditsPositionDropdown.svelte";

  type CreditsPositionSelectorProps = {
    slug: string;
    type: MediaType;
  };

  const { slug, type }: CreditsPositionSelectorProps = $props();

  const { filterMap } = useFilter();
  const { mode } = useDiscover();

  const { credits, positions: allPositions } = useCreditsList({
    type$: fromRune(() => type),
    slug$: fromRune(() => slug),
    filter$: filterMap,
    mode$: mode,
  });

  const requestedPosition = $derived(parseRequestedPosition(page.url, type));
  const selectedPosition = $derived(
    resolveSelectedPosition({ requested: requestedPosition, credits: $credits }),
  );

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
