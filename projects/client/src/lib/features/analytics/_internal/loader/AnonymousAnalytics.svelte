<script lang="ts">
  import { isSupported } from "firebase/analytics";
  import { onMount } from "svelte";
  import type { AnalyticsProps } from "./AnalyticsProps";

  const { onload }: AnalyticsProps = $props();

  onMount(async () => {
    if (!(await isSupported())) {
      return;
    }

    onload(null);
  });
</script>
