<script lang="ts">
  import { setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";
  import {
    PARAMETER_OVERRIDE_CONTEXT_KEY,
    useParameters,
  } from "./useParameters";

  useParameters();

  const { children, parameter }: ChildrenProps & { parameter: string } =
    $props();

  setContext<Writable<string>>(
    PARAMETER_OVERRIDE_CONTEXT_KEY,
    writable(parameter),
  );
</script>

{@render children()}
