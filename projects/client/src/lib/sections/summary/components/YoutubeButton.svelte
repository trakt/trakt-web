<script lang="ts">
  import * as m from "$lib/features/i18n/messages";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import TrollIcon from "$lib/components/icons/TrollIcon.svelte";
  import YouTubeIcon from "$lib/components/icons/YouTubeIcon.svelte";
  import { DEFAULT_TRAILER } from "$lib/utils/constants";

  const { trailer = DEFAULT_TRAILER }: { trailer: string | Nil } = $props();
  const isDefaultTrailer = $derived(trailer === DEFAULT_TRAILER);
</script>

<ActionButton
  href={trailer}
  target="_blank"
  label={m.watch_the_trailer()}
  color="red"
  variant="secondary"
>
  {#if isDefaultTrailer}
    <TrollIcon />
  {:else}
    <YouTubeIcon />
  {/if}
</ActionButton>
