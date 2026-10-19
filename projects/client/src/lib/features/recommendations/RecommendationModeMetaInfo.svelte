<script lang="ts">
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { useRecommendationMode } from "./useRecommendationMode";

  const { current, isApplicable } = useRecommendationMode();
</script>

{#if $isApplicable}
  <ListMetaInfo text={$current.text()} />
{/if}
