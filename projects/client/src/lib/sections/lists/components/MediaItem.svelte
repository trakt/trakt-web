<script lang="ts">
  import MediaCard from "./MediaCard.svelte";
  import type { MediaCardProps } from "./MediaCardProps";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: MediaCardProps = $props();
  const style = $derived(props.style ?? "cover");
</script>

{#if style === "cover"}
  <MediaCard
    {...props}
    {style}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/if}

{#if style === "summary"}
  <MediaSummaryCard
    {...props}
    {style}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/if}
