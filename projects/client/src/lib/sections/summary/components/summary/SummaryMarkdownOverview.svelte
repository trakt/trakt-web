<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";

  type SummaryMarkdownOverviewProps = {
    title: string;
    overview: string;
  };

  const { title, overview }: SummaryMarkdownOverviewProps = $props();
</script>

<ClampedText
  label={m.button_label_expand_media_overview({ title })}
  lineCount={6}
>
  <InlineMarkdown text={overview} />
</ClampedText>
