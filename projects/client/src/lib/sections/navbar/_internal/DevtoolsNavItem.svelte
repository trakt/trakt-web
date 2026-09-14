<script lang="ts">
  import CodeIcon from "$lib/components/icons/CodeIcon.svelte";
  import { devtoolsStore } from "$lib/features/devtools/devtoolsStore.ts";
  import NavGroup from "./NavGroup.svelte";

  const { isCollapsed }: { isCollapsed: boolean } = $props();

  const title = "Devtools";
</script>

{#snippet iconDevtools()}<CodeIcon />{/snippet}

<NavGroup
  onclick={devtoolsStore.openDrawer}
  label={title}
  {title}
  icon={iconDevtools}
  {isCollapsed}
/>
