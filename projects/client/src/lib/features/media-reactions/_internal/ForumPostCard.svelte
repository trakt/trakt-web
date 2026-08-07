<script lang="ts">
  import ClampedText from "$lib/components/text/ClampedText.svelte";
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ForumPost } from "$lib/requests/models/ForumPost.ts";
  import ReactionGlyph from "./ReactionGlyph.svelte";

  const { post }: { post: ForumPost } = $props();

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  });

  const createdLabel = $derived(
    dateFormatter.format(new Date(post.createdAt)),
  );
</script>

<article class="trakt-forum-post-card">
  <header class="post-header">
    <span class="post-avatar" data-vip={post.author.isVip} aria-hidden="true">
      {#if post.author.avatarUrl}
        <img src={post.author.avatarUrl} alt="" loading="lazy" />
      {:else}
        {post.author.displayName.charAt(0)}
      {/if}
    </span>

    <div class="post-meta">
      <span class="post-author bold ellipsis">{post.author.displayName}</span>
      <span class="post-handle secondary small">@{post.author.username}</span>
    </div>

    <span class="post-glyph">
      <ReactionGlyph sentiment={post.sentiment} />
    </span>
  </header>

  <div class="post-body">
    <ClampedText label={m.reactions_read_more()} lineCount={3}>
      {post.body}
    </ClampedText>
  </div>

  {#if post.gifUrl}
    <div class="post-gif">
      <img src={post.gifUrl} alt={m.reaction_forum_gif_alt()} loading="lazy" />
    </div>
  {/if}

  <footer class="post-footer secondary small">
    <span class="post-likes">{m.reaction_forum_like_count({ count: post.likeCount })}</span>
    <span class="post-dot" aria-hidden="true">·</span>
    <span class="post-date">{createdLabel}</span>
  </footer>

  {#if post.replies.length > 0}
    <ul class="post-replies">
      {#each post.replies as reply (reply.id)}
        <li class="post-reply">
          <span class="reply-author bold small">{reply.author.displayName}</span>
          <span class="reply-body small">{reply.body}</span>
        </li>
      {/each}
    </ul>
  {/if}
</article>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  .trakt-forum-post-card {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    padding: var(--gap-s);

    border: var(--border-thickness-xxs) solid var(--color-card-border);
    border-radius: var(--border-radius-l);
    background: var(--color-card-background);

    .post-header {
      display: flex;
      align-items: center;
      gap: var(--gap-xs);
    }

    .post-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      width: var(--ni-32);
      height: var(--ni-32);
      overflow: hidden;

      border-radius: 50%;
      background: color-mix(in srgb, var(--purple-500) 20%, transparent);
      color: var(--purple-500);

      font-weight: 600;
      text-transform: uppercase;

      &[data-vip="true"] {
        box-shadow: 0 0 0 var(--border-thickness-xs) var(--orange-500);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .post-meta {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .post-glyph {
      --reaction-glyph-size: var(--font-size-h4, 1.4em);
      flex-shrink: 0;
    }

    .post-gif {
      overflow: hidden;
      border-radius: var(--border-radius-m);

      img {
        display: block;
        width: 100%;
        max-height: var(--ni-220);
        object-fit: cover;
      }
    }

    .post-footer {
      display: flex;
      align-items: center;
      gap: var(--gap-xxs);
    }

    .post-replies {
      all: unset;
      display: flex;
      flex-direction: column;
      gap: var(--gap-xxs);

      margin-top: var(--gap-xxs);
      padding-inline-start: var(--gap-s);
      border-inline-start: var(--border-thickness-xs) solid
        var(--color-card-border);
    }

    .post-reply {
      display: flex;
      gap: var(--gap-xxs);

      .reply-body {
        color: var(--color-text-secondary);
      }
    }
  }
</style>
