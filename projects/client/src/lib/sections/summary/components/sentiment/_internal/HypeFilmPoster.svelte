<script lang="ts">
  import { useQuery } from "$lib/features/query/useQuery";
  import { movieSummaryQuery } from "$lib/requests/queries/movies/movieSummaryQuery";
  import { fromRune } from "$lib/utils/store/fromRune.svelte.ts";
  import { map } from "rxjs";
  import StoryPoster from "./StoryPoster.svelte";

  const { slug, title, stars }: { slug: string; title: string; stars: number } =
    $props();

  const poster = useQuery(
    fromRune(() => slug).pipe(map((slug) => movieSummaryQuery({ slug }))),
  ).pipe(map(($q) => $q.data?.poster.url.thumb ?? null));
</script>

<StoryPoster src={$poster} {title} {stars} />
