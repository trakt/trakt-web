<script lang="ts">
  import CheckIcon from "$lib/components/icons/CheckIcon.svelte";
  import ActionButton from "../ActionButton.svelte";

  const props: Omit<ButtonProps, "children"> = $props();
</script>

<ActionButton variant="purple" {...props}>
  <CheckIcon />
</ActionButton>
