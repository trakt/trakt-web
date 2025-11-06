<script lang="ts">
  import Toggler from "$lib/components/toggles/Toggler.svelte";
  import { useDiscover } from "$lib/features/discover/useDiscover";

  const { mode: selectedType, setMode, options } = useDiscover();
</script>

<Toggler value={$selectedType} variant="text" onChange={setMode} {options} />
