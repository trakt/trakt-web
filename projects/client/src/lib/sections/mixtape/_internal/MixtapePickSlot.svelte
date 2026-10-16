<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import CloseIcon from "$lib/components/icons/CloseIcon.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import type { MixtapePickSlotProps } from "./MixtapePickSlotProps.ts";

  const { media, removeHref }: MixtapePickSlotProps = $props();
</script>

<div class="trakt-mixtape-pick-slot">
  {#if media}
    <CrossOriginImage
      classList="pick-poster"
      src={media.poster.url.thumb}
      alt={m.image_alt_media_poster({ title: media.title })}
    />
    <div class="pick-remove">
      <Button
        href={removeHref}
        noscroll
        replacestate
        size="small"
        style="flat"
        variant="secondary"
        label={m.button_label_mixtape_remove_pick({ title: media.title })}
      >
        <CloseIcon />
      </Button>
    </div>
  {/if}
</div>

<style lang="scss">
  .trakt-mixtape-pick-slot {
    position: relative;
    aspect-ratio: 2 / 3;
    border-radius: var(--border-radius-m);
    overflow: hidden;
    background: var(--color-card-background);
    box-shadow: var(--shadow-floating);

    :global(.pick-poster) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .pick-remove {
      position: absolute;
      inset-block-start: var(--gap-xxs);
      inset-inline-end: var(--gap-xxs);
    }
  }
</style>
