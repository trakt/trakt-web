<script lang="ts">
  import { EpisodeIntlProvider } from "$lib/components/episode/EpisodeIntlProvider";
  import ShowProgressTag from "$lib/components/episode/tags/ShowProgressTag.svelte";
  import ActivityTag from "$lib/components/media/tags/ActivityTag.svelte";
  import AirDateTag from "$lib/components/media/tags/AirDateTag.svelte";
  import DurationTag from "$lib/components/media/tags/DurationTag.svelte";
  import { TagIntlProvider } from "$lib/components/media/tags/TagIntlProvider";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import MarkAsWatchedAction from "$lib/sections/media-actions/mark-as-watched/MarkAsWatchedAction.svelte";
  import EpisodeCard from "./EpisodeCard.svelte";
  import type { EpisodeCardProps } from "./EpisodeCardProps";
  import MediaSummaryCard from "./MediaSummaryCard.svelte";

  const props: EpisodeCardProps = $props();

  const isFuture = $derived(props.episode.airDate > new Date());
  const isActivity = $derived(props.variant === "activity");
  const isHidden = $derived(props.status === "hidden");
  const style = $derived(props.style ?? "cover");

  const runtime = $derived(
    isNaN(props.episode.runtime) ? props.show.runtime : props.episode.runtime,
  );
</script>

{#snippet action()}
  {#if !isFuture && !isActivity && !isHidden}
    <RenderFor audience="authenticated">
      <MarkAsWatchedAction
        mode="act"
        style="action"
        type="episode"
        size="small"
        title={props.episode.title}
        media={props.episode}
        show={props.show}
      />
    </RenderFor>
  {/if}
{/snippet}

{#snippet tag()}
  {#if props.tag}
    {@render props.tag()}
  {:else}
    <div class="trakt-episode-tag">
      {#if ["default"].includes(props.variant)}
        <DurationTag i18n={TagIntlProvider} {runtime} type="tag" />
      {/if}

      {#if props.variant === "next"}
        <ShowProgressTag
          i18n={TagIntlProvider}
          progress={props.episode.completed}
          total={props.episode.total}
          {runtime}
        >
          <TextTag>
            <p class="meta-info capitalize ellipsis">
              {EpisodeIntlProvider.remainingText(props.episode.remaining)}
            </p>
          </TextTag>
          <TextTag>
            <p class="meta-info capitalize no-wrap">
              {EpisodeIntlProvider.durationText(props.episode.minutesLeft)}
            </p>
          </TextTag>
        </ShowProgressTag>
      {/if}

      {#if props.variant === "upcoming"}
        <AirDateTag
          i18n={TagIntlProvider}
          airDate={props.episode.airDate}
          type="tag"
        />
      {/if}

      {#if props.variant === "activity"}
        <ActivityTag
          i18n={TagIntlProvider}
          activityDate={props.date}
          type="tag"
        />
      {/if}
    </div>
  {/if}
{/snippet}

{#snippet card()}
  {#if style === "summary"}
    <MediaSummaryCard
      episode={props.episode}
      source={props.source}
      media={{
        ...props.show,
        episode: {
          count: 0,
        },
      }}
      popupActions={props.popupActions}
      {tag}
      {action}
      type="episode"
      style="summary"
    />
  {/if}

  {#if style === "cover"}
    <EpisodeCard {...props} {tag} {action} />
  {/if}
{/snippet}

{#if props.status === "hidden"}
  <trakt-hidden-show>
    {@render card()}
  </trakt-hidden-show>
{:else}
  {@render card()}
{/if}

<style lang="scss">
  @use "$style/scss/mixins/index.scss" as *;

  trakt-hidden-show {
    :global(.trakt-card-footer-information),
    :global(.trakt-card-cover),
    :global(.trakt-summary-item) {
      filter: contrast(0.65) grayscale(1);
    }
  }

  .trakt-episode-tag {
    width: 100%;

    display: flex;
    align-items: center;

    gap: var(--gap-micro);

    :global(.trakt-tag) {
      background: var(--color-background-cover-tag);
    }
  }
</style>
