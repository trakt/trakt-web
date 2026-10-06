<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const {
    title,
    children,
    variant = "default",
  }: {
    title: string;
    variant?: "default" | "inline" | "compact";
  } & ChildrenProps = $props();
</script>

<div
  class="trakt-filter"
  data-dpad-navigation={DpadNavigationType.List}
  data-variant={variant}
>
  <span class:secondary={variant === "inline"}>{title}</span>
  {@render children()}
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    min-width: 0;

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: var(--gap-s);

      width: 100%;
      min-height: var(--ni-40);
      box-sizing: border-box;
      padding-inline-start: var(--gap-xxs);

      > span {
        flex-shrink: 0;
        white-space: nowrap;
      }
    }

    &[data-variant="compact"] {
      --select-chip-border: var(--color-filter-group-border);

      > span {
        @include visually-hidden;
      }
    }
  }
</style>
