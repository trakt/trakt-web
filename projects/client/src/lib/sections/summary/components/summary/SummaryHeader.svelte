<script lang="ts">
  import PopupMenu from "$lib/components/buttons/popup/PopupMenu.svelte";
  import * as m from "$lib/features/i18n/messages";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { Snippet } from "svelte";

  const {
    children,
    headerActions,
    popupActions,
    title,
  }: ChildrenProps & {
    headerActions?: Snippet;
    popupActions?: Snippet;
    title: string;
  } = $props();
</script>

<div class="trakt-summary-header">
  <div class="trakt-summary-header-children">
    {@render children()}
  </div>

  {#if headerActions || popupActions}
    <div class="trakt-summary-action-header">
      {#if headerActions}
        <RenderFor audience="all">
          {@render headerActions()}
        </RenderFor>
      {/if}

      {#if popupActions}
        <RenderFor audience="all">
          <PopupMenu
            label={m.button_label_popup_menu({ title })}
            size="normal"
            mode="standalone"
          >
            {#snippet items()}
              {@render popupActions()}
            {/snippet}
          </PopupMenu>
        </RenderFor>
      {/if}
    </div>
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-summary-action-header {
    width: 100%;

    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--gap-xs);

    flex: 1;
  }

  .trakt-summary-header-children {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--gap-m);
  }

  .trakt-summary-header {
    display: flex;
    gap: var(--gap-xs);
    justify-content: space-between;
  }
</style>
