<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import Button from "$lib/components/buttons/Button.svelte";
  import TrollIcon from "$lib/components/icons/TrollIcon.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import { DEFAULT_TRAILER } from "$lib/utils/constants";

  const { trailer = DEFAULT_TRAILER }: { trailer: string | Nil } = $props();
  const isDefaultTrailer = $derived(trailer === DEFAULT_TRAILER);
</script>

<Button href={trailer} target="_blank" label={"Trailer"} color="red">
  {m.watch_the_trailer()}
  {#snippet subtitle()}
    YouTube
  {/snippet}
  {#snippet icon()}
    {#if isDefaultTrailer}
      <TrollIcon />
    {:else}
      <YouTubeIcon />
    {/if}
  {/snippet}
</Button>
