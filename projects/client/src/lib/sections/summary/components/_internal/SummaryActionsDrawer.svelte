<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import DropdownGroup from "$lib/components/dropdown/DropdownGroup.svelte";

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
  <Drawer {onClose} {title} {metaInfo} size="auto">
    <DropdownGroup>
      {@render children()}
    </DropdownGroup>
  </Drawer>
{/if}
