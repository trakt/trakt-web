<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages";

  type SummaryOverviewProps = {
    title: string;
    overview: string;
  };

  const { title, overview }: SummaryOverviewProps = $props();
</script>

<ClampedText label={m.button_label_expand_media_overview({ title })}>
  {overview}
</ClampedText>
