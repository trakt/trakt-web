<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";

  type EpisodeRemainingProps = {
    i18n: EpisodeIntl;
    remaining: number;
  };

  const { i18n, remaining }: EpisodeRemainingProps = $props();
</script>

<TextTag>
  <p class="bold capitalize ellipsis">
    {i18n.remainingText(remaining)}
  </p>
</TextTag>
