<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import TagByType from "$lib/components/tags/TagByType.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";

  type EpisodeRemainingProps = {
    i18n: EpisodeIntl;
    remaining: number;
    type?: TagType;
  };

  const { i18n, remaining, type = "text" }: EpisodeRemainingProps = $props();
</script>

<TagByType {type}>
  <p class="bold capitalize ellipsis">
    {i18n.remainingText(remaining)}
  </p>
</TagByType>
