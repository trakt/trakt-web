<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import type { Snippet } from "svelte";
  import ListTitle from "./ListTitle.svelte";

  const {
    title,
    subtitle,
    metaInfo,
    titleAction,
    actions,
    badge,
    navigationType,
    href,
    listActions,
    ...props
  }: {
    title: string;
    subtitle?: string;
    metaInfo?: Snippet;
    titleAction?: Snippet;
    actions?: Snippet;
    badge?: Snippet;
    listActions?: Snippet;
    navigationType?: DpadNavigationType;
    href?: string;
  } & HTMLElementProps = $props();

  const { navigation } = useNavigation();
  const hasHiddenActions = $derived($navigation === "dpad" && !navigationType);
</script>

<div class="trakt-list-inset-title" {...props}>
  <div class="trakt-list-header">
    <div class="trakt-list-title-container">
      <div class="trakt-list-title">
        {#if titleAction}
          {@render titleAction()}
        {/if}
        {#if subtitle == null}
          <ListTitle {title} {href} {metaInfo} style="primary" />
        {:else}
          <ListTitle {title} {href} {metaInfo} style="secondary" />
          <ListTitle title={`/ ${subtitle}`} style="primary" />
        {/if}
      </div>
      {#if badge}
        {@render badge()}
      {/if}
    </div>

    {#if actions != null && !hasHiddenActions}
      <div class="trakt-list-actions" data-dpad-navigation={navigationType}>
        {@render actions()}
      </div>
    {/if}
  </div>

  {#if listActions}
    {@render listActions()}
  {/if}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-inset-title {
    margin: 0;
    margin-left: var(--layout-distance-side);
    margin-right: var(--layout-distance-side);
    transition: margin-left calc(var(--transition-increment) * 2) ease-in-out;

    @include for-tablet-sm-and-below {
      margin-left: calc(var(--layout-distance-side));
    }
  }

  .trakt-list-header {
    display: flex;
    align-items: center;
    gap: var(--gap-xs);
    min-height: var(--ni-40);
    height: var(--ni-40);
    user-select: none;

    .trakt-list-actions {
      display: flex;
      gap: var(--gap-xs);
      align-items: center;
    }

    .trakt-list-title,
    .trakt-list-title-container {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
      min-width: 0;

      :global(.trakt-preview-badge) {
        // To visually align the badge with the title
        margin-top: var(--ni-8);
      }
    }

    .trakt-list-title {
      gap: var(--gap-micro);
    }

    .trakt-list-title,
    .trakt-list-actions {
      :global(.trakt-action-button) {
        --button-size: var(--ni-32);
      }

      @include for-mobile {
        :global(.trakt-action-button) {
          --button-size: var(--ni-24);

          :global(svg) {
            width: var(--ni-16);
            height: var(--ni-16);
          }
        }
      }
    }

    @include for-mobile {
      gap: var(--gap-xs);
    }
  }
</style>
