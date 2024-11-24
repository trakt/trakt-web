<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import RecommendationList from "$lib/sections/recommendations/RecommendationList.svelte";
</script>

<RecommendationList title={m.recommended_shows()} type="show" />
