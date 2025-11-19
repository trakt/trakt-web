<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import ListHeader from "$lib/components/lists/_internal/ListHeader.svelte";
  import CollapseIcon from "$lib/components/lists/section-list/CollapseIcon.svelte";
  import ExpandIcon from "$lib/components/lists/section-list/ExpandIcon.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useCollapsedSection } from "$lib/stores/useCollapsedSection";
  import { whenInViewport } from "$lib/utils/actions/whenInViewport";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const {
    id,
    title,
    toggleLabels,
    children,
  }: {
    id: string;
    title: string;
    toggleLabels: { expand: string; collapse: string };
  } & ChildrenProps = $props();

  const isVisible = writable(false);
  const isMounted = writable(false);
  const { isCollapsed, toggle } = $derived(
    useCollapsedSection(`section_collapsed_${id}`, true),
  );

  onMount(() => {
    isMounted.set(true);
  });
</script>

{#snippet titleAction()}
  <RenderFor audience="all">
    <ActionButton
      onclick={toggle}
      label={$isCollapsed ? toggleLabels.expand : toggleLabels.collapse}
      style="ghost"
      color="default"
    >
      {#if $isCollapsed}
        <ExpandIcon />
      {:else}
        <CollapseIcon />
      {/if}
    </ActionButton>
  </RenderFor>
{/snippet}

<section
  use:whenInViewport={() => isVisible.set(true)}
  class="collapsable-section-container"
  class:collapsable-section-container-collapsed={$isCollapsed}
  class:collapsable-section-container-mounted={$isMounted}
>
  {#if $isVisible}
    <ListHeader {title} {titleAction} inset="title" />

    <div class="collapsable-section">
      {@render children()}
    </div>
  {/if}
</section>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .collapsable-section-container {
    --height-min-container: var(--ni-40);

    min-height: var(--height-min-container);

    contain: layout;
    content-visibility: auto;

    display: flex;
    flex-direction: column;

    gap: var(--list-header-gap);

    &.collapsable-section-container-mounted {
      .collapsable-section {
        transition: max-height var(--transition-increment) ease-in-out;
      }
    }
  }

  .collapsable-section {
    max-height: var(--height-content);
    padding: 0 var(--layout-distance-side);
  }

  .collapsable-section-container.collapsable-section-container-collapsed {
    overflow: hidden;

    .collapsable-section {
      max-height: 0;
    }
  }
</style>
