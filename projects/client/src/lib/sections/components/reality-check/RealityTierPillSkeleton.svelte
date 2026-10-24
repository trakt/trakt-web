<script lang="ts">
  import Skeleton from "$lib/components/skeleton/Skeleton.svelte";

  const { variant = "card" }: { variant?: "card" | "compact" } = $props();
</script>

<Skeleton
  width={variant === "card" ? "var(--ni-112)" : "var(--ni-96)"}
  height="var(--ni-24)"
  radius="var(--border-radius-xxl)"
/>
