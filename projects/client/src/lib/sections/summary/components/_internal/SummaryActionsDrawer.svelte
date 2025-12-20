<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";

  const {
    children,
    isOpen,
    onOpenChange,
    title,
    metaInfo,
  }: {
    isOpen: boolean;
    onOpenChange: (value: boolean) => void;
    title: string;
    metaInfo?: string;
  } & ChildrenProps = $props();

  const onClose = () => onOpenChange(false);
</script>

{#if isOpen}
  <Drawer {onClose} {title} {metaInfo}>
    <div class="trakt-media-actions">
      {@render children()}
    </div>
  </Drawer>
{/if}

<style>
  .trakt-media-actions {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xxs);
  }
</style>
