<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import ListDrilldownAction from "$lib/components/lists/ListDrilldownAction.svelte";
  import type { ListDrilldownProps } from "$lib/components/lists/section-list/models/ListDrilldownProps";
  import { useEditMode } from "$lib/features/edit-mode/useEditMode";

  const { title, drilldown }: { title: string; drilldown: ListDrilldownProps } =
    $props();

  const { isEditMode } = useEditMode();
</script>

<div class="trakt-drawer-drilldown-title">
  {#if $isEditMode}
    <span class="drawer-title-text">{title}</span>
  {:else}
    <ListDrilldownAction {drilldown} disabled={drilldown.mode === "disabled"}>
      <span class="drawer-title-text">{title}</span>
      <CaretRightIcon />
    </ListDrilldownAction>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-drawer-drilldown-title {
    color: var(--color-text-primary);
    display: flex;
    flex-direction: column;
    min-width: 0;

    :global(.trakt-list-drilldown-action),
    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
      min-width: 0;
      text-decoration: none;

      :global(svg) {
        flex-shrink: 0;
        width: calc(var(--font-size-title) * 0.9);
        height: calc(var(--font-size-title) * 0.9);

        transition: color var(--transition-increment) ease-in-out;
      }

      @include for-mouse {
        &:hover {
          color: var(--color-link-active);
        }
      }
    }

    :global(.trakt-list-drilldown-action:disabled),
    :global(.trakt-no-link) {
      :global(svg) {
        color: var(--color-foreground-button-disabled);
      }
    }
  }

  .drawer-title-text {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-size: var(--font-size-title);
    line-height: var(--ni-22);

    transition: color var(--transition-increment) ease-in-out;
  }
</style>
