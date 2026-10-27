<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";
  import { splitRecapSummary } from "./splitRecapSummary.ts";

  const REST_LINE_COUNT = 2;

  const { summary }: { summary: string } = $props();

  const { lead, rest } = $derived(splitRecapSummary(summary));
</script>

<div class="trakt-recap-summary">
  <p class="bold recap-lead"><InlineMarkdown text={lead} /></p>

  {#if rest}
    <div class="recap-rest">
      <ClampedText
        label={m.button_label_read_more()}
        lineCount={REST_LINE_COUNT}
        classList="secondary"
      >
        <InlineMarkdown text={rest} />
      </ClampedText>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-recap-summary {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    .recap-lead,
    .recap-rest {
      :global(span) {
        font-size: inherit;
        font-weight: inherit;
      }
    }

    .recap-lead {
      font-size: var(--font-size-title);
      line-height: 1.4;
    }
  }
</style>
