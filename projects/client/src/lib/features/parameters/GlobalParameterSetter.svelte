<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import { PARAMETER_SETTER_CONTEXT_KEY } from "./_internal/createParameterContext";
  import { useParameters } from "./useParameters";

  useParameters();

  const { children, parameter }: ChildrenProps & { parameter: string } =
    $props();

  iffy(() => {
    setContext<Writable<string>>(
      PARAMETER_SETTER_CONTEXT_KEY,
      writable(parameter),
    );
  });
</script>

{@render children()}
