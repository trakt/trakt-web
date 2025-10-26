<script lang="ts">
  import ProfileIcon from "$lib/components/icons/ProfileIcon.svelte";
  import SocialIcon from "$lib/components/icons/SocialIcon.svelte";
  import ThumbsUpIcon from "$lib/components/icons/ThumbsUpIcon.svelte";
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import type { DiscoverMode } from "$lib/features/discover/models/DiscoverMode.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useNavigation } from "$lib/features/navigation/useNavigation.ts";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import type { Cta } from "../components/cta/models/Cta.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import CreateListAction from "./_internal/CreateListAction.svelte";
  import ListsHeader from "./_internal/ListsHeader.svelte";
  import PersonalListsPlaceholder from "./_internal/PersonalListsPlaceholder.svelte";
  import { useCreateList } from "./_internal/useCreateList.ts";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const {
    type,
    slug,
    mode,
  }: { type: PersonalListType; slug: string; mode?: DiscoverMode } = $props();

  const { lists, isLoading } = $derived(
    usePersonalListsSummary({ type, slug }),
  );
  const { navigation } = useNavigation();

  const title = $derived.by(() => {
    switch (type) {
      case "personal":
        return m.list_title_personal_lists();
      case "liked":
        return m.list_title_liked_lists();
      case "collaboration":
        return m.list_title_collaborative_lists();
      default:
        return "";
    }
  });

  const { isMe } = $derived(useIsMe(slug));
  const isMobile = useMedia(WellKnownMediaQuery.mobile);
  const isDPad = $navigation === "dpad";

  const variant = $derived.by(() => {
    if ($isMobile || isDPad) {
      return "preview";
    }

    return "summary";
  });

  const isMine = $derived(type === "personal" && $isMe);
  const isPresentable = $derived(isMine || (!$isLoading && $lists.length > 0));

  const { createList, isCreating } = useCreateList();

  const cta: Cta = $derived({
    type: "personal-list",
    action: {
      onClick: createList,
      disabled: $isCreating,
    },
  });
</script>

{#snippet emptyList()}
  {#if !$isLoading}
    {m.list_placeholder_personal_list_empty()}
  {/if}
{/snippet}

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

      {#if isMine && $lists.length === 0}
        <PersonalListsPlaceholder {cta} />
      {/if}

      {#each $lists as list (list.id)}
        <UserList {list} empty={emptyList} type={mode} />
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
          {#if $isMe}
            <CtaItem {cta} variant="placeholder" />
          {:else}
            {@render emptyList()}
          {/if}
        {/if}
      {/snippet}
    </SectionList>
  {/if}
{/if}

<style>
  .trakt-lists-preview {
    display: flex;
    flex-direction: column;
    gap: var(--gap-micro);
  }
</style>
