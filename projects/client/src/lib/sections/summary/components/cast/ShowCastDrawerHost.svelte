<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery.ts";
  import type { MediaCrew } from "$lib/requests/models/MediaCrew.ts";
  import { showPeopleQuery } from "$lib/requests/queries/shows/showPeopleQuery.ts";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import CastDrawerHost from "./CastDrawerHost.svelte";

  const { slug, crew, onClose }: {
    slug: string;
    crew: MediaCrew;
    onClose: () => void;
  } = $props();

  const people = useQuery(
    fromRune(() => slug).pipe(
      map((slug) => showPeopleQuery({ slug, guestStars: true })),
    ),
  );
</script>

<CastDrawerHost crew={$people.data ?? crew} type="show" {onClose} />
