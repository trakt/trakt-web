<script lang="ts">
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";

  type RecommendedShowsProps = {
    title: string;
  };

  const { title }: RecommendedShowsProps = $props();
</script>

<RecommendationList {title} type="show" />
