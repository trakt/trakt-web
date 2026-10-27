<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { RecapLine } from "$lib/requests/models/RecapLine.ts";
  import RecapOpenThreads from "./RecapOpenThreads.svelte";
  import RecapPersonCard from "./RecapPersonCard.svelte";

  const { lines, caption }: {
    lines: ReadonlyArray<RecapLine>;
    caption: string;
  } = $props();

  const personLines = $derived(lines.filter(({ people }) => people.length > 0));
  const openLines = $derived(lines.filter(({ people }) => people.length === 0));
</script>

<section class="trakt-recap-lines">
  <div class="lines-header">
    <h3>{m.header_recap_where_things_stand()}</h3>
    <span class="small secondary">{caption}</span>
  </div>

  <div class="lines-grid">
    {#each personLines as line (line.key)}
      <RecapPersonCard {line} />
    {/each}

    {#if openLines.length > 0}
      <RecapOpenThreads lines={openLines} />
    {/if}
  </div>
</section>

<style lang="scss">
  .trakt-recap-lines {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .lines-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: var(--gap-xs);
    }

    .lines-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      grid-auto-flow: row dense;
      gap: var(--gap-xs);
    }
  }
</style>
