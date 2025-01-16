<script lang="ts">
  import type { Snippet } from "svelte";
  import ListTitle from "./ListTitle.svelte";

  const {
    title,
    inset,
    actions,
  }: { title: string; actions?: Snippet; inset: "all" | "title" } = $props();
</script>

<div
  class="trakt-list-header"
  class:trakt-list-inset-title={inset === "title"}
  class:trakt-inset-all={inset === "all"}
>
  <ListTitle {title} />
  {#if actions != null}
    <div class="trakt-list-actions">
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
    gap: var(--ni-16);

    &.trakt-list-inset-title {
      margin: 0;
      margin-left: calc(var(--ni-72) + var(--layout-distance-side));
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
      gap: var(--ni-8);
      align-items: center;
    }
  }
</style>
