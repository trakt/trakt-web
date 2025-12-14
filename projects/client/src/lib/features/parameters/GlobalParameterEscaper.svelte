<script lang="ts">
  import { iffy } from "$lib/utils/function/iffy";
  import { BehaviorSubject } from "rxjs";
  import { setContext } from "svelte";
  import { PARAMETER_ESCAPE_KEY } from "./_internal/createParameterContext";

  const { children, enabled }: ChildrenProps & { enabled: boolean } = $props();

  iffy(() => {
    setContext<BehaviorSubject<boolean>>(
      PARAMETER_ESCAPE_KEY,
      new BehaviorSubject(enabled),
    );
  });
</script>

{@render children()}
