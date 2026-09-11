<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";

  type CommentGifProps = {
    url: string;
    variant: "full" | "preview";
  };

  const { url, variant }: CommentGifProps = $props();
</script>

<img
  class="trakt-comment-gif"
  data-variant={variant}
  src={url}
  alt={m.image_alt_comment_gif()}
  loading="lazy"
  decoding="async"
/>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-comment-gif {
    display: block;
    box-sizing: border-box;

    border-radius: var(--border-radius-s);
    background-color: var(--color-input-background);

    &[data-variant="full"] {
      align-self: flex-start;

      // Capped on both axes so the browser scales the gif down whole: a
      // portrait one would otherwise run the length of the thread.
      width: auto;
      height: auto;
      max-width: min(100%, var(--ni-320));
      max-height: var(--ni-320);
    }

    &[data-variant="preview"] {
      // A fixed slot rather than the gif's own shape, so the row beside it is
      // the same width on every card and does not reflow once the gif lands.
      flex-shrink: 0;
      width: var(--ni-72);
      height: 100%;
      object-fit: cover;
    }
  }

  // A media spoiler blurs the comment's words but has no rule for images, so
  // the gif would give away on its own what the text is hiding.
  :global(trakt-spoiler.trakt-spoiler) .trakt-comment-gif {
    @include spoiler-blur();
  }
</style>
