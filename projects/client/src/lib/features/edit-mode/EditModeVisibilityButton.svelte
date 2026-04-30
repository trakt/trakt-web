<script lang="ts">
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import VisibilityIcon from "$lib/components/icons/VisibilityIcon.svelte";

  const {
    isHidden,
    label,
    onclick,
  }: { isHidden: boolean; label: string; onclick: () => void } = $props();
</script>

<ActionButton style="ghost" {label} {onclick}>
  <VisibilityIcon state={isHidden ? "hidden" : "visible"} />
</ActionButton>
