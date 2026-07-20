<script lang="ts">
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";

  type EpisodeDurationProps = {
    i18n: EpisodeIntl;
    minutesLeft: number;
  };

  const { i18n, minutesLeft }: EpisodeDurationProps = $props();
</script>

<TextTag>
  <p class="bold capitalize ellipsis">
    <bdi dir="auto">{i18n.durationText(minutesLeft)}</bdi>
  </p>
</TextTag>
