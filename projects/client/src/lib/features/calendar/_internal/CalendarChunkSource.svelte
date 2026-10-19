<script lang="ts" generics="T">
  import { onMount, untrack } from "svelte";
  import type { CalendarChunkResult } from "../models/CalendarChunkResult.ts";

  const {
    load,
    register,
  }: {
    load: () => CalendarChunkResult<T>;
    register: (result: CalendarChunkResult<T>) => () => void;
  } = $props();

  const result = untrack(() => load());

  onMount(() => register(result));
</script>
