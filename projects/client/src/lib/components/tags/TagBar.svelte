<script lang="ts">
  const {
    children,
    isWrappable = false,
  }: ChildrenProps & { isWrappable?: boolean } = $props();
</script>

{#if isWrappable}
  <div class="trakt-tag-bar-wrap">
    <div class="trakt-tag-bar" data-wrap="true">
      {@render children()}
    </div>
  </div>
{:else}
  <div class="trakt-tag-bar">
    {@render children()}
  </div>
{/if}

<style>
  .trakt-tag-bar-wrap {
    min-width: 0;
    overflow-x: clip;
  }

  .trakt-tag-bar {
    --tag-bar-separator-width: var(--ni-12);

    display: flex;
    align-items: center;
    gap: var(--gap-xxs);

    > :global(:not(:last-child))::after {
      content: "·";

      font-size: var(--font-size-separator);
      line-height: var(--ni-12);
    }

    &[data-wrap="true"] {
      flex-wrap: wrap;
      gap: var(--gap-micro) 0;

      margin-inline-start: calc(-1 * var(--tag-bar-separator-width));

      > :global(*) {
        position: relative;
        padding-inline-start: var(--tag-bar-separator-width);
      }

      > :global(:not(:last-child))::after {
        content: none;
      }

      > :global(*)::before {
        content: "·";

        position: absolute;
        inset-block: 0;
        inset-inline-start: 0;
        width: var(--tag-bar-separator-width);

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: var(--font-size-separator);
        line-height: var(--ni-12);
      }
    }
  }
</style>
