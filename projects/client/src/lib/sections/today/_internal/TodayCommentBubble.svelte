<script lang="ts">
  import Link from "$lib/components/link/Link.svelte";
  import { lineClamp } from "$lib/components/text/lineClamp.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import CrossOriginImage from "$lib/features/image/components/CrossOriginImage.svelte";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import type { TodayFriendAction } from "../models/TodayFriendAction.ts";

  type Comment = NonNullable<TodayFriendAction["comment"]>;

  const { comment, lines = 4 }: { comment: Comment; lines?: number } =
    $props();
</script>

<div class="trakt-today-comment-bubble">
  <Link
    href={UrlBuilder.comment(comment.id)}
    label={m.button_label_open_comment()}
    color="inherit"
  >
    <div class="bubble-body">
    {#if comment.isSpoiler}
      <p class="tag uppercase bold bubble-spoiler">{m.text_spoiler()}</p>
    {:else}
      <p class="small" use:lineClamp={{ lines }}>{comment.text}</p>
    {/if}
    {#if comment.gif && !comment.isSpoiler}
      <div class="bubble-gif">
        <CrossOriginImage src={comment.gif.url} alt="" />
      </div>
    {/if}
    </div>
  </Link>
</div>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-today-comment-bubble {
    :global(.trakt-link) {
      display: block;
      border-radius: var(--border-radius-l);
      text-decoration: none;
    }

    :global(.trakt-link:focus-visible) {
      outline: var(--border-thickness-xs) solid var(--color-text-emphasis);
      outline-offset: var(--ni-2);
    }

    .bubble-body {
      display: flex;
      flex-direction: column;
      gap: var(--gap-xs);

      padding: var(--gap-s) var(--gap-m);
      border: var(--border-thickness-xxs) solid var(--color-border);
      border-radius: var(--border-radius-l);
      border-start-start-radius: var(--border-radius-xs);

      background: var(--color-card-background);
      color: var(--color-text-primary);

      transition: border-color var(--transition-increment) ease-in-out;

      @include for-mouse {
        &:hover {
          border-color: var(--color-text-emphasis);
        }
      }
    }

    .bubble-spoiler {
      color: var(--color-text-emphasis);
    }

    .bubble-gif :global(img) {
      max-width: 100%;
      max-height: var(--ni-120);
      border-radius: var(--border-radius-s);
    }
  }
</style>
