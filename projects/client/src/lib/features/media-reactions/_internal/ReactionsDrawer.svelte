<script lang="ts">
  import Drawer from "$lib/components/drawer/Drawer.svelte";
  import { FeatureFlag } from "$lib/features/feature-flag/models/FeatureFlag.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import RenderForFeature from "$lib/guards/RenderForFeature.svelte";
  import type { ForumPost } from "$lib/requests/models/ForumPost.ts";
  import type { ReactionAuthor } from "$lib/requests/models/ReactionAuthor.ts";
  import type { ReactionSentiment } from "$lib/requests/models/ReactionSentiment.ts";
  import { reactionSentimentDefinitions } from "../reactionSentimentDefinitions.ts";
  import ForumComposer from "./ForumComposer.svelte";
  import ReactionChip from "./ReactionChip.svelte";
  import ReactionEchoList from "./ReactionEchoList.svelte";
  import type { ReactionsDrawerProps } from "./ReactionsDrawerProps.ts";

  const { type, slug, title, summary, chosen, onSelect, onClose }:
    ReactionsDrawerProps = $props();

  const orderedMetrics = $derived(
    (Object.keys(reactionSentimentDefinitions) as ReactionSentiment[])
      .map((sentiment) =>
        summary.metrics.find((metric) => metric.sentiment === sentiment)
      )
      .filter((metric) => metric != null),
  );

  // Optimistic posts you add, kept per mood so switching moods shows the right
  // set. The server mutation plugs in behind handleSubmit later.
  let addedBySentiment = $state<Record<string, ForumPost[]>>({});

  const currentUser: ReactionAuthor = {
    username: "you",
    displayName: "You",
    isVip: false,
  };

  function handleSubmit(
    { body, gifUrl }: { body: string; gifUrl: string | null },
  ) {
    if (chosen == null) {
      return;
    }

    const post: ForumPost = {
      id: crypto.randomUUID(),
      sentiment: chosen,
      author: currentUser,
      body,
      gifUrl,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      replies: [],
    };

    addedBySentiment = {
      ...addedBySentiment,
      [chosen]: [post, ...(addedBySentiment[chosen] ?? [])],
    };
  }
</script>

<Drawer
  title={m.reactions_section_title()}
  metaInfo={title}
  size="large"
  {onClose}
>
  <div class="trakt-reactions-drawer">
    <!-- Top section: your reaction — pick a mood, then add words / a GIF. -->
    <div class="reactions-compose">
      <p class="reactions-prompt secondary">{m.reactions_section_subtitle()}</p>

      <div class="reactions-picker" role="list">
        {#each orderedMetrics as metric (metric.sentiment)}
          <div role="listitem">
            <ReactionChip
              sentiment={metric.sentiment}
              count={metric.count}
              selected={metric.sentiment === chosen}
              onclick={() => onSelect(metric.sentiment)}
            />
          </div>
        {/each}
      </div>

      <RenderForFeature flag={FeatureFlag.ReactionForum}>
        {#snippet enabled()}
          <ForumComposer onSubmit={handleSubmit} disabled={chosen == null} />
        {/snippet}
        <p class="composer-locked secondary small">
          {m.reaction_forum_composer_locked()}
        </p>
      </RenderForFeature>
    </div>

    <!-- Bottom section: echoes of others who felt the same. -->
    {#if chosen != null}
      <div class="reactions-echo-section">
        <ReactionEchoList
          {type}
          {slug}
          sentiment={chosen}
          addedPosts={addedBySentiment[chosen] ?? []}
        />
      </div>
    {:else}
      <p class="reactions-pick-hint secondary">{m.reactions_pick_hint()}</p>
    {/if}
  </div>
</Drawer>

<style lang="scss">
  .trakt-reactions-drawer {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);

    .reactions-compose {
      display: flex;
      flex-direction: column;
      gap: var(--gap-s);
    }

    .reactions-picker {
      display: flex;
      flex-wrap: wrap;
      gap: var(--gap-xs);
    }

    .composer-locked {
      padding: var(--gap-s);
      border: var(--border-thickness-xxs) dashed var(--color-card-border);
      border-radius: var(--border-radius-m);
      text-align: center;
    }

    .reactions-echo-section {
      padding-top: var(--gap-m);
      border-top: var(--border-thickness-xxs) solid var(--color-card-border);
    }

    .reactions-pick-hint {
      padding-block: var(--gap-m);
      text-align: center;
    }
  }
</style>
