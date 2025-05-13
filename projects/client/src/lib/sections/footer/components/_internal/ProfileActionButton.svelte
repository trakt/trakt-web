<script lang="ts">
  import LogoutButton from "./LogoutButton.svelte";

  const { size }: { size: "small" | "tag" } = $props();
</script>

<LogoutButton {size} />
