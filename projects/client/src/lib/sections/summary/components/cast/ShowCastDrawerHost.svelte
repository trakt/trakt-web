<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import CastDrawerHost from "./CastDrawerHost.svelte";
  import type { ShowCastDrawerHostProps } from "./ShowCastDrawerHostProps.ts";

  const { slug, crew, onClose }: ShowCastDrawerHostProps = $props();

  const people = useQuery(
    fromRune(() => slug).pipe(
      map((slug) => showPeopleQuery({ slug, guestStars: true })),
    ),
  );
</script>

<CastDrawerHost
  crew={$people.data ?? crew}
  type="show"
  isLoading={toLoadingState($people)}
  {onClose}
/>
