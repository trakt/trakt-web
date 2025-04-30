<script lang="ts">
  import { setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { PARAMETER_SETTER_CONTEXT_KEY } from "./_internal/createParameterContext";
  import { useParameters } from "./useParameters";

  useParameters();

  const { children, parameter }: ChildrenProps & { parameter: string } =
    $props();

  setContext<Writable<string>>(
    PARAMETER_SETTER_CONTEXT_KEY,
    writable(parameter),
  );
</script>

{@render children()}
