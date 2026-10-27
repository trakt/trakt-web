<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import TrackIcon from "$lib/components/icons/TrackIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry.ts";
  import { markAsWatchedDrawerStore } from "../markAsWatchedDrawerStore.ts";

  const {
    seasonLabel,
    episodes,
    show,
  }: {
    seasonLabel: string;
    episodes: ReadonlyArray<EpisodeEntry>;
    show: { id: number; title: string };
  } = $props();

  const title = $derived(`${show.title} ${seasonLabel}`);

  const finish = () =>
    markAsWatchedDrawerStore.open({
      title,
      mediaStore: { type: "episode", media: [...episodes], show },
      elevated: true,
    });
</script>

<Button
  style="ghost"
  color="default"
  text="none"
  label={m.button_label_finish_season({
    count: episodes.length,
    season: seasonLabel,
  })}
  onclick={finish}
>
  {m.button_text_finish_season()}
  {#snippet icon()}
    <TrackIcon state="unwatched" />
  {/snippet}
</Button>
