<script lang="ts">
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import ProgressTag from "$lib/components/media/tags/ProgressTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import { languageTag } from "$lib/features/i18n";
  import { toHumanDuration } from "$lib/utils/formatting/date/toHumanDuration";
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
    {#if props.variant === "next"}
      <ProgressTag progress={props.progress ?? 0}>
        <span class="no-wrap media-progress">
          {toHumanDuration({ minutes: props.minutesLeft }, languageTag())}
          remaining
        </span>
      </ProgressTag>
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
    tag={props.variant === "next" ? coverTag : undefined}
  />
{/if}

<style>
  .media-progress {
    display: flex;
    align-items: center;
    position: relative;
  }

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
