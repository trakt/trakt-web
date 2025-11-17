<script lang="ts">
  import ShareButton from "$lib/components/buttons/share/ShareButton.svelte";
  import * as m from "$lib/features/i18n/messages";
  import type { EpisodeEntry } from "$lib/requests/models/EpisodeEntry";

  const {
    title,
    showTitle,
    episode,
    style = "action",
    variant,
  }: {
    title: string;
    showTitle: string;
    episode: EpisodeEntry;
    style?: "action" | "dropdown-item";
    variant?: "primary" | "secondary";
  } = $props();
</script>

<ShareButton
  {title}
  {style}
  {variant}
  textFactory={({ title }) =>
    m.text_share_episode({
      title,
      show: showTitle,
      season: episode.season,
      episode: episode.number,
    })}
  source={{ id: "episode" }}
/>
