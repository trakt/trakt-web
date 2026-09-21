<script lang="ts">
  import { useSplitCast } from "$lib/features/feature-flag/useSplitCast.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { combineLatest, map } from "rxjs";
  import CastDrawerHost from "./CastDrawerHost.svelte";
  import type { ShowCastDrawerHostProps } from "./ShowCastDrawerHostProps.ts";

  const { slug, crew, onClose }: ShowCastDrawerHostProps = $props();

  const people = useQuery(
    combineLatest([fromRune(() => slug), useSplitCast()]).pipe(
      map(([slug, guestStars]) => showPeopleQuery({ slug, guestStars })),
    ),
  );
</script>

<CastDrawerHost crew={$people.data ?? crew} type="show" {onClose} />
