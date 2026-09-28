<script lang="ts">
  import SwitchBase from "./_internal/SwitchBase.svelte";
  import type { SwitchProps } from "./SwitchProps.ts";

  const props: SwitchProps = $props();
</script>

<SwitchBase variant="flat" {...props} />
