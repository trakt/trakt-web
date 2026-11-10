<script lang="ts">
  import SummaryHeaderBulletDot from "../../../header-kit/SummaryHeaderBulletDot.svelte";
  import { Marked } from "marked";

  /*
    Trivia facts as a strip column, structurally the same as the sentiment
    bullets - a marker, then one short line - so the columns scan as one system.

    Facts arrive as markdown (titles come through italicised), so they render the
    same way the trivia card on this page already renders the very same strings.
    Keeping both on `marked` means a fact cannot read one way in the header and
    another in the drawer.
  */
  const { facts }: { facts: ReadonlyArray<string> } = $props();

  const marked = new Marked();
</script>

<ul class="trakt-summary-header-trivia">
  {#each facts as fact, index (index)}
    <li>
      <SummaryHeaderBulletDot />
      <div class="trivia-text" dir="auto">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html marked.parse(fact)}
      </div>
    </li>
  {/each}
</ul>

<style lang="scss">
  .trakt-summary-header-trivia {
    display: flex;
    flex-direction: column;
    gap: var(--summary-header-row-gap, var(--ni-12));

    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--ni-10);
    }
  }

  .trivia-text {
    /* API text keeps its own direction; its lines still align with the page. */
    text-align: -webkit-match-parent;
    text-align: match-parent;

    font-size: var(--font-size-text);
    line-height: var(--ni-20);
    color: var(--color-text-primary);
    text-wrap: pretty;

    :global(p) {
      margin: 0;
    }
  }
</style>
