<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { episodeNumberLabel } from "$lib/utils/intl/episodeNumberLabel";

  const {
    seasonNumber,
    episodeNumber,
  }: { seasonNumber: number; episodeNumber: number } = $props();
</script>

<TextTag>
  <p class="bold capitalize no-wrap">
    {episodeNumberLabel({ seasonNumber, episodeNumber })}
  </p>
</TextTag>
