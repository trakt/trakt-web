<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { Season } from "$lib/requests/models/Season.ts";
  import type { ShowRecapStory } from "$lib/requests/models/ShowRecapStory.ts";
  import { toRecapDuration } from "../toRecapDuration.ts";
  import RecapLines from "./RecapLines.svelte";
  import RecapStoryProgress from "./RecapStoryProgress.svelte";
  import RecapStoryTimeline from "./RecapStoryTimeline.svelte";
  import { toStoryProgress } from "./toStoryProgress.ts";

  const { story, seasons }: {
    story: ShowRecapStory;
    seasons: ReadonlyArray<Pick<Season, "number" | "episodes" | "airDate">>;
  } = $props();

  const progress = $derived(
    toStoryProgress({
      seasons,
      covered: story.segments.map(({ season }) => season),
    }),
  );

  const duration = $derived(
    toRecapDuration([
      ...story.segments.map(({ text }) => text),
      ...story.lines.map(({ text }) => text),
    ]),
  );

  const linesCaption = $derived(
    progress.nextSeason == null
      ? m.text_recap_at_the_finale()
      : m.text_recap_before_season({ number: progress.nextSeason }),
  );
</script>

<div class="trakt-recap-story">
  <p class="small secondary">{m.text_recap_story_description()}</p>

  <RecapStoryProgress {progress} {duration} />

  <RecapStoryTimeline
    segments={story.segments}
    {seasons}
    nextSeason={progress.nextSeason}
  />

  <RecapLines lines={story.lines} caption={linesCaption} />
</div>

<style>
  .trakt-recap-story {
    display: flex;
    flex-direction: column;
    gap: var(--gap-l);
  }
</style>
