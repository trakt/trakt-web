<script lang="ts">
  import StemTag from "$lib/components/tags/StemTag.svelte";
  import TextTag from "$lib/components/tags/TextTag.svelte";
  import type { MediaStatus } from "$lib/requests/models/MediaStatus";
  import { getMediaStatus } from "./getMediaStatus";
  import type { TagType } from "./models/TagType";
  import type { TagIntl } from "./TagIntl";

  type MediaStatusProps = {
    i18n: TagIntl;
    status: MediaStatus;
    effectiveReleaseDate: Date;
    type?: TagType;
  };

  const {
    i18n,
    status,
    effectiveReleaseDate,
    type = "text",
  }: MediaStatusProps = $props();

  const resolved = $derived(getMediaStatus(status, effectiveReleaseDate));
</script>

{#snippet tagContent(text: string)}
  <div class="trakt-media-status">
    <div class="trakt-media-status-indicator" data-status={resolved}></div>
    <p class="bold capitalize ellipsis">
      {text}
    </p>
  </div>
{/snippet}

{#snippet tag(text: string)}
  {#if type === "text"}
    <TextTag>{@render tagContent(text)}</TextTag>
  {:else}
    <StemTag>{@render tagContent(text)}</StemTag>
  {/if}
{/snippet}

{#if resolved === "new"}
  {@render tag(i18n.newLabel())}
{/if}

<style>
  .trakt-media-status {
    display: flex;
    align-items: center;
    gap: var(--gap-xxs);
  }

  .trakt-media-status-indicator {
    --indicator-size: var(--ni-6);

    width: var(--indicator-size);
    height: var(--indicator-size);
    border-radius: 50%;

    &[data-status="new"] {
      background-color: var(--blue-500);
    }
  }
</style>
