<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ClampedText from "$lib/components/text/ClampedText.svelte";

  type SummaryOverviewProps = {
    title: string;
    overview: string;
  };

  const { title, overview }: SummaryOverviewProps = $props();
</script>

<ClampedText
  classList="trakt-media-overview secondary"
  label={m.expand_media_overview({ title })}
>
  {overview}
</ClampedText>

<style>
  :global(.trakt-media-overview) {
    line-height: 150%;
  }
</style>
