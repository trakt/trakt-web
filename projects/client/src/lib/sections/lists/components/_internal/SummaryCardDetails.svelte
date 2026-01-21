<script lang="ts">
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { appendClassList } from "$lib/utils/actions/appendClassList";
  import type { Snippet } from "svelte";
  import { fade } from "svelte/transition";

  const {
    children,
    tag,
    classList = "",
  }: { tag?: Snippet; classList?: string } & ChildrenProps = $props();
</script>

<div class="trakt-summary-card-details" use:appendClassList={classList}>
  <div class="trakt-summary-card-titles">
    {@render children()}
  </div>

  {#if tag}
    <RenderFor audience="all" device={["tablet-lg", "desktop"]}>
      <div class="trakt-summary-card-tags" in:fade={{ duration: 150 }}>
        {@render tag()}
      </div>
    </RenderFor>
  {/if}
</div>

<style>
  .trakt-summary-card-details {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    flex-grow: 1;
    z-index: var(--layer-raised);

    overflow: hidden;

    padding: var(--ni-12);
    padding-top: var(--ni-10);

    .trakt-summary-card-titles {
      display: flex;
      flex-direction: column;
      gap: var(--gap-micro);
    }
  }

  .trakt-summary-card-tags {
    :global(.trakt-tag-bar) {
      display: grid;
      grid-template-columns: 1fr 1fr;

      :global(:not(:last-child))::after {
        display: none;
      }
    }
  }
</style>
