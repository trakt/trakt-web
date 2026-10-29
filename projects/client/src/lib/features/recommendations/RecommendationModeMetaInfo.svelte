<script lang="ts">
  import ListMetaInfo from "$lib/sections/components/ListMetaInfo.svelte";
  import { useRecommendationMode } from "./useRecommendationMode";

  const { current } = useRecommendationMode();
</script>

<ListMetaInfo text={$current.text()} />
