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
  <span>{title}</span>
  {@render children()}
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    &[data-variant="inline"] {
      flex-direction: row;
      align-items: center;
      gap: var(--gap-m);
    }
  }
</style>
