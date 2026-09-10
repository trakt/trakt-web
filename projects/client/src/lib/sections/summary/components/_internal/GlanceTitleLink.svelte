<script lang="ts">
  import CaretRightIcon from "$lib/components/icons/CaretRightIcon.svelte";
  import Link from "$lib/components/link/Link.svelte";

  const { children, href }: { href: string } & ChildrenProps = $props();
</script>

<div class="trakt-glance-title-link">
  <Link {href} target="_self">
    {@render children()}
    <CaretRightIcon />
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-glance-title-link {
    --glance-caret-size: calc(var(--font-size-text) * 0.9);

    min-width: 0;
    max-width: 100%;

    :global(.trakt-link) {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
      min-width: 0;
      max-width: 100%;

      padding-inline-start: calc(
        var(--glance-caret-size) + var(--gap-xxs)
      );

      text-decoration: none;

      > :global(*:first-child) {
        min-width: 0;

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      :global(svg) {
        flex-shrink: 0;

        width: var(--glance-caret-size);
        height: var(--glance-caret-size);

        color: var(--color-text-primary);

        transition: color var(--transition-increment) ease-in-out;
      }

      @include for-mouse {
        &:hover {
          color: var(--color-link-active);

          :global(svg) {
            color: var(--color-link-active);
          }
        }
      }
    }
  }
</style>
