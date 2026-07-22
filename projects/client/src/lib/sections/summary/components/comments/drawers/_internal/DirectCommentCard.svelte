<script lang="ts">
  import Card from "$lib/components/card/Card.svelte";
  import { getLocale } from "$lib/features/i18n/index.ts";
  import type { MediaComment } from "$lib/requests/models/MediaComment.ts";
  import TextCardHeader from "$lib/sections/components/text-card/TextCardHeader.svelte";
  import UserAvatar from "$lib/sections/lists/components/UserAvatar.svelte";
  import UserProfileLink from "$lib/sections/lists/components/UserProfileLink.svelte";
  import { spoilMeAnyway } from "$lib/features/spoilers/components/spoilMeAnyway";
  import { toHumanDay } from "$lib/utils/formatting/date/toHumanDay.ts";
  import { Marked } from "marked";
  import ReactAction from "../../_internal/comment-actions/ReactAction.svelte";
  import CommenterRating from "../../_internal/CommenterRating.svelte";
  import CommentFooter from "../../_internal/CommentFooter.svelte";
  import { createHeadingRenderer } from "../../_internal/marked/createHeadingRenderer";
  import { createParagraphRenderer } from "../../_internal/marked/createParagraphRenderer";
  import { spoilerExtension } from "../../_internal/marked/spoilerExtension";

  const { comment }: { comment: MediaComment } = $props();

  const marked = $derived(
    new Marked({
      extensions: [spoilerExtension()],
      renderer: {
        paragraph: createParagraphRenderer(comment.isSpoiler),
        heading: createHeadingRenderer(),
      },
    }),
  );
</script>

<Card
  --width-card="100%"
  --height-card="fit-content"
  classList="trakt-direct-comment-card"
>
  <div class="trakt-direct-comment-container">
    <TextCardHeader
      subTitle={toHumanDay({ date: comment.createdAt, locale: getLocale() })}
    >
      {#snippet icon()}
        <UserAvatar user={comment.user} size="small" />
      {/snippet}

      {#snippet actions()}
        <CommenterRating {comment} />
      {/snippet}

      <UserProfileLink user={comment.user} />
    </TextCardHeader>

    <div
      class="trakt-comment"
      class:trakt-spoiler={comment.isSpoiler}
      use:spoilMeAnyway
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      {@html marked.parse(comment.comment, { gfm: true, breaks: true })}
    </div>

    <CommentFooter>
      <ReactAction {comment} />
    </CommentFooter>
  </div>
</Card>

<style lang="scss">
  @use "$style/scss/mixins/index" as *;

  :global(.trakt-card.trakt-direct-comment-card .trakt-card-content),
  .trakt-direct-comment-container {
    --vertical-padding: var(--ni-16);
    min-height: calc(var(--height-comment-card) - 2 * var(--vertical-padding));
  }

  .trakt-direct-comment-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap-m);
    justify-content: flex-start;

    padding: var(--vertical-padding) var(--ni-20);

    height: 100%;
    box-sizing: border-box;

    :global(.trakt-spoiler) {
      cursor: pointer;
    }
  }

  .trakt-comment {
    display: flex;
    flex-direction: column;
    gap: var(--gap-xs);

    font-size: var(--font-size-text);

    :global(a) {
      @include default-link-style;
    }

    :global(p),
    :global(li) {
      font-size: inherit;
    }

    :global(.trakt-comment-heading) {
      text-transform: none;
      text-decoration: underline;
    }

    &,
    :global(p) {
      transition: var(--transition-increment) ease-in-out;
      transition-property: filter, padding;
    }

    &:global(.trakt-spoiler),
    :global(p.trakt-spoiler span) {
      @include spoiler-blur();
    }

    :global(p.trakt-spoiler span) {
      pointer-events: none;
    }
  }
</style>
