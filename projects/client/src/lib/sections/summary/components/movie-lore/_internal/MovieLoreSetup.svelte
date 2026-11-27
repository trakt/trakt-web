<script lang="ts">
  import InlineMarkdown from "$lib/sections/components/markdown/InlineMarkdown.svelte";

  const { lines }: { lines: ReadonlyArray<string> } = $props();

  const lead = $derived(lines.at(0) ?? "");
  const rest = $derived(lines.slice(1));
</script>

<div class="trakt-movie-lore-setup">
  <p class="bold setup-lead"><InlineMarkdown text={lead} /></p>

  {#if rest.length > 0}
    <div class="setup-rest secondary">
      {#each rest as line, index (index)}
        <p><InlineMarkdown text={line} /></p>
      {/each}
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-movie-lore-setup {
    display: flex;
    flex-direction: column;
    gap: var(--ni-10);

    .setup-lead,
    .setup-rest {
      :global(span) {
        font-size: inherit;
        font-weight: inherit;
      }
    }

    .setup-lead {
      font-size: var(--font-size-title);
      line-height: 1.4;
    }

    .setup-rest {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);
    }
  }
</style>
