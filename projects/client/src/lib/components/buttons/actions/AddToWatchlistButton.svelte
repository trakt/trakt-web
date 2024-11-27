<script lang="ts">
  import MarkAsWatchedIcon from "$lib/components/icons/MarkAsWatchedIcon.svelte";
  import ActionButton from "../ActionButton.svelte";

  const props: Omit<ButtonProps, "children"> = $props();
</script>

<ActionButton variant="blue" {...props}>
  <MarkAsWatchedIcon />
</ActionButton>
