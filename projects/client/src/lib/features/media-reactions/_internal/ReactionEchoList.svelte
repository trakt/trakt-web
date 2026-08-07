<script lang="ts">
  import * as m from "$lib/features/i18n/messages.ts";
  import type { ForumPost } from "$lib/requests/models/ForumPost.ts";
  import { useReactionForum } from "../stores/useReactionForum.ts";
  import ForumPostCard from "./ForumPostCard.svelte";
  import type { ReactionEchoListProps } from "./ReactionEchoListProps.ts";

  const { type, slug, sentiment, addedPosts }: ReactionEchoListProps = $props();

  const forum = $derived(useReactionForum({ type, slug, sentiment }).forum);
  const posts = $derived<ForumPost[]>([...addedPosts, ...forum.posts]);
</script>

<div class="trakt-reaction-echo">
  <p class="echo-count secondary small">
    {m.reaction_forum_meta({ count: posts.length })}
  </p>

  {#if posts.length === 0}
    <p class="echo-empty secondary">{m.reaction_forum_empty()}</p>
  {:else}
    <ul class="echo-posts">
      {#each posts as post (post.id)}
        <li><ForumPostCard {post} /></li>
      {/each}
    </ul>
  {/if}
</div>

<style lang="scss">
  .trakt-reaction-echo {
    display: flex;
    flex-direction: column;
    gap: var(--gap-s);

    .echo-posts {
      all: unset;
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .echo-empty {
      padding-block: var(--gap-m);
      text-align: center;
    }
  }
</style>
