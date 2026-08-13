<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  const { to }: { to: string } = $props();

  onMount(() => {
    const target = new URL(to, page.url.origin);
    if (page.url.pathname === target.pathname) return;
    goto(to, {
      replaceState: true,
    });
  });
</script>
