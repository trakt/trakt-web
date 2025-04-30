<script lang="ts">
  import { setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { PARAMETER_ESCAPE_KEY } from "./_internal/createParameterContext";

  const { children, enabled }: ChildrenProps & { enabled: boolean } = $props();

  setContext<Writable<boolean>>(PARAMETER_ESCAPE_KEY, writable(enabled));
</script>

{@render children()}
