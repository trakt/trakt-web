<script lang="ts">
  import SparkleIcon from "$lib/components/icons/SparkleIcon.svelte";
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
      <span class="trivia-marker" aria-hidden="true">
        <SparkleIcon />
      </span>
      <div class="trivia-text">
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
    gap: var(--gap-s);

    margin: 0;
    padding: 0;
    list-style: none;

    li {
      display: flex;
      align-items: flex-start;
      gap: var(--gap-s);
    }
  }

  /*
    A box exactly one line of trivia text tall, centring the sparkle on that first
    line - the same construction the sentiment bullets use, so a marker cannot end
    up optically higher in one column than the other.
  */
  .trivia-marker {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;

    width: var(--ni-16);
    height: calc(var(--font-size-text) * 1.5);

    color: var(--purple-400);

    :global(svg) {
      width: var(--ni-16);
      height: var(--ni-16);
    }
  }

  .trivia-text {
    font-size: var(--font-size-text);
    line-height: 1.5;
    color: var(--color-text-secondary);
    text-wrap: pretty;

    :global(p) {
      margin: 0;
    }
  }
</style>
