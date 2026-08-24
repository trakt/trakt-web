<script lang="ts">
  import { initializeUserManager } from "$lib/features/auth/stores/initializeUserManager.ts";
  import { untrack } from "svelte";

  const { params, output }: {
    params: Parameters<typeof initializeUserManager>[0];
    output: (value: ReturnType<typeof initializeUserManager>) => void;
  } = $props();

  untrack(() => output(initializeUserManager(params)));
</script>
