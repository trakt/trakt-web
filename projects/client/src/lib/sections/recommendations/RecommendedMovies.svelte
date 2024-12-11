<script lang="ts">
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";

  type RecommendedMoviesProps = {
    title: string;
  };

  const { title }: RecommendedMoviesProps = $props();
</script>

<RecommendationList {title} type="movie" />
