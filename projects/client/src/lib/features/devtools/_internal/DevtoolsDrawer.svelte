<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import { DEVTOOLS_TITLE } from "../devtoolsTitle.ts";
  import { devtoolsEntries } from "./devtoolsEntries.ts";

  const { onClose }: { onClose: () => void } = $props();
</script>

<Drawer {onClose} title={DEVTOOLS_TITLE} metaInfo="Development only">
  <div class="trakt-devtools-drawer">
    {#each devtoolsEntries as entry (entry.id)}
      <button
        class="devtools-entry"
        type="button"
        onclick={() => {
          onClose();
          entry.run();
        }}
      >
        <CodeIcon />
        <span class="entry-text">
          <span class="bold">{entry.title}</span>
          <span class="small secondary">{entry.description}</span>
        </span>
      </button>
    {/each}
  </div>
</Drawer>

<style lang="scss">
  .trakt-devtools-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);
  }

  .devtools-entry {
    display: flex;
    align-items: center;
    gap: var(--gap-s);
    text-align: start;

    padding: var(--gap-s);
    border: none;
    border-radius: var(--border-radius-m);
    background: var(--color-card-background);
    color: inherit;
    cursor: pointer;

    &:focus-visible {
      outline: var(--border-thickness-xs) solid var(--color-link-active);
    }

    :global(svg) {
      width: var(--ni-24);
      height: var(--ni-24);
      flex-shrink: 0;
    }
  }

  .entry-text {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
    min-width: 0;
  }
</style>
