<script lang="ts">
  import { DpadNavigationType } from "$lib/features/navigation/models/DpadNavigationType";

  const { title, children }: { title: string } & ChildrenProps = $props();
</script>

<div class="trakt-filter" data-dpad-navigation={DpadNavigationType.List}>
  <span class="bold">{title}</span>
  {@render children()}
</div>

<style>
  .trakt-filter {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);
  }
</style>
