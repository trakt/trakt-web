<script lang="ts">
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import { useFeatureFlag } from "$lib/features/feature-flag/useFeatureFlag.ts";
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { toLoadingState } from "$lib/utils/requests/toLoadingState.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { combineLatest, map } from "rxjs";
  import CastDrawerHost from "./CastDrawerHost.svelte";
  import type { ShowCastDrawerHostProps } from "./ShowCastDrawerHostProps.ts";

  const { slug, crew, spoiler, onClose }: ShowCastDrawerHostProps = $props();

  const isPortraitsEnabled = useFeatureFlag().isEnabled(
    FeatureFlag.CharacterPortraits,
  );
  const people = useQuery(
    combineLatest([fromRune(() => slug), isPortraitsEnabled]).pipe(
      map(([slug, portraits]) =>
        showPeopleQuery({ slug, guestStars: true, portraits }),
      ),
    ),
  );
</script>

<CastDrawerHost
  crew={$people.data ?? crew}
  type="show"
  {spoiler}
  isLoading={toLoadingState($people)}
  {onClose}
/>
