<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import { useEditMode } from "./useEditMode";

  const { exit } = useEditMode();
</script>

<Button label="TODO" size="small" color="default" onclick={exit}>
  Exit edit mode
</Button>
