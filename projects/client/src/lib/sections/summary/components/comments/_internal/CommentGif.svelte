<script lang="ts">
  import KlipyWatermark from "$lib/features/gif-picker/KlipyWatermark.svelte";
  import * as m from "$lib/features/i18n/messages.ts";

  type CommentGifProps = {
    url: string;
    variant: "full" | "preview";
  };

  const { url, variant }: CommentGifProps = $props();
</script>

<div class="trakt-comment-gif" data-variant={variant}>
  <img
    src={url}
    alt={m.image_alt_comment_gif()}
    loading="lazy"
    decoding="async"
  />
  <KlipyWatermark />
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-gif {
    position: relative;
    display: flex;
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    overflow: hidden;
    background-color: var(--color-input-background);

    img {
      display: block;
    }

    &[data-variant="full"] {
      align-self: flex-start;
      max-width: 100%;

      img {
        width: auto;
        height: auto;
        max-width: min(100%, var(--ni-320));
        max-height: var(--ni-320);
      }
    }

    &[data-variant="preview"] {
      flex-shrink: 0;
      width: var(--ni-72);
      height: 100%;

      --klipy-watermark-inset: var(--ni-4);
      --klipy-watermark-width: var(--ni-32);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  // The spoiler rule covers the comment's words but not its images.
  :global(trakt-spoiler.trakt-spoiler) .trakt-comment-gif {
    @include spoiler-blur();
  }
</style>
