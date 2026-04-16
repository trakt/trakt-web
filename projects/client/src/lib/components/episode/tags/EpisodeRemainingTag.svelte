<script lang="ts">
  import type { TagType } from "$lib/components/media/tags/models/TagType";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { EpisodeIntl } from "../EpisodeIntl";

  type EpisodeRemainingProps = {
    i18n: EpisodeIntl;
    remaining: number;
    type?: TagType;
  };

  const { i18n, remaining, type = "text" }: EpisodeRemainingProps = $props();
</script>

{#if type === "text"}
  <TextTag>
    <p class="bold capitalize ellipsis">
      {i18n.remainingText(remaining)}
    </p>
  </TextTag>
{:else}
  <StemTag>
    <p class="bold capitalize ellipsis">
      {i18n.remainingText(remaining)}
    </p>
  </StemTag>
{/if}
