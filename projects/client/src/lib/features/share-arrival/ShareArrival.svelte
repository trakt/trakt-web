<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { useShareArrival } from "./useShareArrival";

  const { report } = useShareArrival();

  onMount(() => {
    report({ url: page.url, route: page.route.id });
  });
</script>
