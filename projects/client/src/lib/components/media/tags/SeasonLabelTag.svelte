<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import { seasonLabel } from "$lib/utils/intl/seasonLabel";

  const { seasonNumber }: { seasonNumber: number } = $props();
</script>

<TextTag>
  <p class="bold capitalize no-wrap">
    {seasonLabel(seasonNumber)}
  </p>
</TextTag>
