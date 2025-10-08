<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import MediaCard from "./MediaCard.svelte";
  import type { MediaCardProps } from "./MediaCardProps";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: MediaCardProps = $props();
  const style = $derived(props.style ?? "cover");

  const isCover = $derived(style === "cover");
</script>

{#snippet coverTag()}
  <div class="trakt-media-tag">
    {#if props.variant === "activity"}
      <ActivityTag
        i18n={TagIntlProvider}
        activityDate={props.date}
        type={isCover ? "tag" : "text"}
      />
    {/if}
  </div>
{/snippet}

{#if style === "cover"}
  <MediaCard
    {...props}
    {coverTag}
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
