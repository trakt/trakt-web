<script lang="ts">
  import type { MediaCardProps } from "./MediaCardProps";
  import MediaItemCard from "./MediaItemCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: MediaCardProps = $props();
  const style = $derived(props.style ?? "cover");
</script>

{#if style === "cover"}
  <MediaItemCard
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
