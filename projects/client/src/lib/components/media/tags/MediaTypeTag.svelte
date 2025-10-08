<script lang="ts">
  import MovieIcon from "$lib/components/icons/MovieIcon.svelte";
  import ShowIcon from "$lib/components/icons/ShowIcon.svelte";
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { MediaType } from "$lib/requests/models/MediaType";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  const {
    mediaType,
    i18n,
    type = "text",
  }: { mediaType: MediaType; i18n: TagIntl; type?: TagType } = $props();
</script>

{#snippet icon()}
  {#if mediaType === "movie"}
    <MovieIcon />
  {:else if mediaType === "show"}
    <ShowIcon />
  {/if}
{/snippet}

{#snippet content()}
  <p class="meta-info capitalize no-wrap">
    {i18n.mediaTypeLabel(mediaType)}
  </p>
{/snippet}

{#if type === "text"}
  <TextTag {icon}>
    {@render content()}
  </TextTag>
{:else}
  <StemTag {icon}>
    {@render content()}
  </StemTag>
{/if}
