<script lang="ts">
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
      width: fit-content;
      max-width: 100%;
      height: var(--ni-200);

      img {
        width: auto;
        max-width: 100%;
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
