<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  type CommentGifProps = {
    url: string;
    size?: { width: number; height: number } | null;
    variant: "full" | "preview";
  };

  const { url, size, variant }: CommentGifProps = $props();
</script>

<div
  class="trakt-comment-gif"
  data-variant={variant}
  style:--gif-width={size?.width}
  style:--gif-height={size?.height}
>
  <img
    src={url}
    alt={m.image_alt_comment_gif()}
    loading="lazy"
    decoding="async"
  />
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
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &[data-variant="full"] {
      align-self: flex-start;
      max-width: min(100%, var(--ni-320));

      aspect-ratio: var(--gif-width) / var(--gif-height);

      width: min(
        100%,
        calc(var(--gif-width) * 1px),
        var(--ni-320),
        calc(var(--ni-320) * var(--gif-width) / var(--gif-height))
      );

      img {
        max-height: var(--ni-320);
      }
    }

    &[data-variant="preview"] {
      flex-shrink: 0;
      width: var(--ni-72);
      height: 100%;
    }
  }

  // The spoiler rule covers the comment's words but not its images.
  :global(trakt-spoiler.trakt-spoiler) .trakt-comment-gif {
    @include spoiler-blur();
  }
</style>
