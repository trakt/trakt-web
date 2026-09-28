<script lang="ts">
  import SwitchBase from "./_internal/SwitchBase.svelte";
  import type { NoveltySwitchProps } from "./NoveltySwitchProps.ts";

  const { color = "purple", ...props }: NoveltySwitchProps = $props();
</script>

<SwitchBase variant="novelty" {color} {...props} />
