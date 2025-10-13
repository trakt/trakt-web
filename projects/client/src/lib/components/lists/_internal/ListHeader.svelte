<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";
  import { useNavigation } from "$lib/features/navigation/useNavigation";
  import type { Snippet } from "svelte";
  import ListTitle from "./ListTitle.svelte";

  const {
    title,
    subtitle,
    metaInfo,
    inset,
    titleAction,
    actions,
    badge,
    navigationType,
    ...props
  }: {
    title: string;
    subtitle?: string;
    metaInfo?: string;
    titleAction?: Snippet;
    actions?: Snippet;
    badge?: Snippet;
    inset: "all" | "title";
    navigationType?: DpadNavigationType;
  } & HTMLElementProps = $props();

  const { navigation } = useNavigation();
  const hasHiddenActions = $derived(
    $navigation === "dpad" && !Boolean(navigationType),
  );
</script>

<div
  class="trakt-list-header"
  class:trakt-list-inset-title={inset === "title"}
  class:trakt-inset-all={inset === "all"}
  {...props}
>
  <div class="trakt-list-title-container">
    <div class="trakt-list-title">
      {#if titleAction}
        {@render titleAction()}
      {/if}
      {#if subtitle == null}
        <ListTitle {title} {metaInfo} style="primary" />
      {:else}
        <ListTitle {title} {metaInfo} style="secondary" />
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

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--gap-m);
    min-height: var(--ni-40);
    height: var(--ni-40);
    user-select: none;

    &.trakt-list-inset-title {
      margin: 0;
      margin-left: var(--layout-distance-side);
      margin-right: var(--layout-distance-side);
      transition: margin-left calc(var(--transition-increment) * 2) ease-in-out;

      @include for-tablet-sm-and-below {
        margin-left: calc(var(--layout-distance-side));
      }
    }

    &.trakt-inset-all {
      margin: 0 calc(var(--ni-72) + var(--layout-distance-side));
      transition: margin calc(var(--transition-increment) * 2) ease-in-out;

      @include for-tablet-sm-and-below {
        margin: 0 calc(var(--layout-distance-side));
      }
    }

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
