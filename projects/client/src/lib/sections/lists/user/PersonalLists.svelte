<script lang="ts">
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import ThumbsUpIcon from "$lib/components/icons/ThumbsUpIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { writable } from "$lib/utils/store/WritableSubject.ts";
  import { UrlBuilder } from "$lib/utils/url/UrlBuilder.ts";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import type { Cta } from "../components/cta/models/Cta.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import ViewAllButton from "../components/ViewAllButton.svelte";
  import CreateListAction from "./_internal/CreateListAction.svelte";
  import CreateListDrawer from "./_internal/CreateListDrawer.svelte";
  import ListsHeader from "./_internal/ListsHeader.svelte";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const PREVIEW_LIMIT = 3;

  const {
    type,
    slug,
    mode,
  }: { type: PersonalListType; slug: string; mode?: DiscoverMode } = $props();

  const {
    list: lists,
    isLoading,
    hasNextPage,
  } = $derived(usePersonalListsSummary({ type, slug }));

  const { isMe } = $derived(useIsMe(slug));

  const variant = $derived.by(() => {
    const shouldShowSummary =
      $hasNextPage || $lists.length === 0 || $lists.length > PREVIEW_LIMIT;
    return shouldShowSummary ? "summary" : "preview";
  });

  const isMine = $derived(type === "personal" && $isMe);
  const isPresentable = $derived(isMine || (!$isLoading && $lists.length > 0));

  const title = $derived.by(() => {
    switch (type) {
      case "personal":
        return isMine
          ? m.list_title_personal_lists()
          : m.list_title_user_lists();
      case "liked":
        return m.list_title_liked_lists();
      case "collaboration":
        return m.list_title_collaborative_lists();
      default:
        return "";
    }
  });

  const showCreateList = writable(false);

  const cta: Cta = $derived({
    type: "personal-list",
    mediaType: mode === "media" ? undefined : mode,
    action: {
      onClick: () => showCreateList.set(true),
      disabled: false,
    },
  });
</script>

{#if isPresentable}
  {#if variant === "preview"}
    <div class="trakt-lists-preview">
      {#if $isMe}
        <ListsHeader {title}>
          {#snippet icon()}
            {#if type === "personal"}
              <ProfileIcon />
            {:else if type === "collaboration"}
              <SocialIcon />
            {:else}
              <ThumbsUpIcon />
            {/if}
          {/snippet}

          {#snippet actions()}
            {#if isMine && $lists.length > 0}
              <CreateListAction />
            {/if}
          {/snippet}
        </ListsHeader>
      {/if}

      {#each $lists as list (list.id)}
        <UserList {list} type={mode} />
      {/each}
    </div>
  {/if}

  {#if variant === "summary"}
    <SectionList
      id={`personal-lists-${type}-list`}
      items={$lists}
      {title}
      --height-list="var(--height-lists-list)"
    >
      {#snippet item(list)}
        <ListSummaryItem {list} isOfficial={false} type={mode} />
      {/snippet}

      {#snippet dynamicActions()}
        {#if isMine}
          <CreateListAction />
        {/if}
      {/snippet}

      {#snippet empty()}
        {#if !$isLoading}
          {#if isMine}
            <CtaItem {cta} variant="placeholder" />
          {:else}
            {m.list_placeholder_personal_list_empty()}
          {/if}
        {/if}
      {/snippet}

      {#snippet actions()}
        <ViewAllButton
          href={UrlBuilder.lists.all(slug, type)}
          label={m.button_label_view_all_lists()}
          disabled={$lists.length === 0}
          source={{ id: "personal-lists", type }}
        />
      {/snippet}
    </SectionList>
  {/if}
{/if}

{#if $showCreateList}
  <CreateListDrawer onClose={() => showCreateList.set(false)} />
{/if}

<style>
  .trakt-lists-preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
