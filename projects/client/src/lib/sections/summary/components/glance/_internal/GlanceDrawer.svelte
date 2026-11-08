<script lang="ts">
  import FadeInDrawer from "$lib/components/drawer/FadeInDrawer.svelte";

  const {
    classList,
    onClose,
    children,
  }: {
    classList: string;
    onClose: () => void;
  } & ChildrenProps = $props();
</script>

<FadeInDrawer {onClose} size="large" {classList}>
  {@render children()}
</FadeInDrawer>
