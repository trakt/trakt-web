<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import type { Snippet } from "svelte";
  import MediaCard from "./MediaCard.svelte";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";
  import type { MediaCardProps } from "./models/MediaCardProps";

  const {
    contextualTag,
    sortTag,
    ...props
  }: MediaCardProps & { contextualTag?: Snippet; sortTag?: Snippet } = $props();

  const style = $derived(props.style ?? "cover");
  const resolvedStyle = $derived<"cover" | "summary">(
    style === "compact" || style === "minimal" ? "summary" : style,
  );
  const summaryCardLayout = $derived(
    style === "compact" || style === "minimal" ? style : "default",
  );

  const isCover = $derived(resolvedStyle === "cover");
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
    {#if props.variant === "next"}
      <ProgressTag progress={props.progress ?? 0}>
        {TagIntlProvider.toRemainingDuration(props.minutesLeft)}
      </ProgressTag>
    {/if}
    {#if props.coverTag}
      {@render props.coverTag()}
    {/if}
  </div>
{/snippet}

{#if resolvedStyle === "cover"}
  <MediaCard
    {...props}
    {coverTag}
    style={resolvedStyle}
    action={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
  />
{/if}

{#if resolvedStyle === "summary"}
  <MediaSummaryCard
    {...props}
    style={resolvedStyle}
    layout={summaryCardLayout}
    {contextualTag}
    {sortTag}
    badge={props.action}
    popupActions={props.badge ? undefined : props.popupActions}
    tag={props.variant === "next" || props.variant === "progress"
      ? coverTag
      : props.tag}
  />
{/if}

<style>
  .trakt-media-tag {
    width: 100%;

    display: flex;
    align-items: center;

    gap: var(--gap-micro);

    :global(.trakt-tag) {
      background: var(--color-background-cover-tag);
    }
  }
</style>
