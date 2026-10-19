<script lang="ts" generics="T">
  import type { CalendarChunk } from "../models/CalendarChunk.ts";
  import type { CalendarChunkResult } from "../models/CalendarChunkResult.ts";
  import CalendarChunkSource from "./CalendarChunkSource.svelte";

  const {
    sources,
    load,
    register,
  }: {
    sources: ReadonlyArray<{ key: string; chunk: CalendarChunk }>;
    load: (chunk: CalendarChunk) => CalendarChunkResult<T>;
    register: (key: string, result: CalendarChunkResult<T>) => () => void;
  } = $props();
</script>

{#each sources as source (source.key)}
  <CalendarChunkSource
    load={() => load(source.chunk)}
    register={(result) => register(source.key, result)}
  />
{/each}
