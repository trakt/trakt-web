<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  const { to }: { to: string } = $props();

  onMount(() => {
    if (page.url.pathname === to) return;
    goto(to, {
      replaceState: true,
    });
  });
</script>
