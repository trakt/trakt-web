<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import type { Snippet } from "svelte";

  const {
    header,
    footer,
    children,
  }: { header: Snippet; footer?: Snippet } & ChildrenProps = $props();
</script>

<Card>
  <div class="trakt-text-card-content" class:has-footer={Boolean(footer)}>
    {@render header()}
    {@render children()}
    {@render footer?.()}
  </div>
</Card>

<style>
  .trakt-text-card-content {
    position: relative;

    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    padding: var(--ni-16) var(--ni-20);
    box-sizing: border-box;

    &.has-footer {
      justify-content: space-between;
      height: 100%;
    }

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }
</style>
