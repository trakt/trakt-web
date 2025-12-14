<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { BehaviorSubject } from "rxjs";
  import { setContext } from "svelte";
  import { PARAMETER_SETTER_CONTEXT_KEY } from "./_internal/createParameterContext";
  import { useParameters } from "./useParameters";

  useParameters();

  const { children, parameter }: ChildrenProps & { parameter: string } =
    $props();

  iffy(() => {
    setContext<BehaviorSubject<string>>(
      PARAMETER_SETTER_CONTEXT_KEY,
      new BehaviorSubject(parameter),
    );
  });
</script>

{@render children()}
