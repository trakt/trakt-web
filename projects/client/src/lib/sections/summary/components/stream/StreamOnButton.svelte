<script lang="ts">
  import StreamingServiceButton from "$lib/components/buttons/streaming-service/StreamingServiceButton.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import type { StreamOnButtonProps } from "./StreamOnButtonProps";

  const {
    streamOn,
    style,
    size = "small",
    ...target
  }: StreamOnButtonProps = $props();

  const airDate = $derived(
    target.type === "episode" ? target.episode.airDate : target.media.airDate,
  );
  const isAiredItem = $derived(airDate < new Date());
</script>

{#if isAiredItem && streamOn?.preferred}
  <RenderFor audience="authenticated">
    <StreamingServiceButton
      service={streamOn.preferred}
      mediaTitle={target.media.title}
      {style}
      {size}
    />
  </RenderFor>
{/if}
