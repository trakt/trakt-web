<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const {
    title,
    children,
    variant = "default",
  }: {
    title: string;
    variant?: "default" | "inline";
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

<style>
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
      min-height: var(--ni-44);

      > span {
        flex-shrink: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
