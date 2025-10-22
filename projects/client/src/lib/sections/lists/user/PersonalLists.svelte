<script lang="ts">
  import SectionList from "$lib/components/lists/section-list/SectionList.svelte";
  import { useIsMe } from "$lib/features/auth/stores/useIsMe.ts";
  import * as m from "$lib/features/i18n/messages.ts";
  import { useNavigation } from "$lib/features/navigation/useNavigation.ts";
  import RenderFor from "$lib/guards/RenderFor.svelte";
  import { useMedia, WellKnownMediaQuery } from "$lib/stores/css/useMedia.ts";
  import CtaItem from "../components/cta/CtaItem.svelte";
  import type { Cta } from "../components/cta/models/Cta.ts";
  import ListSummaryItem from "../components/list-summary/ListSummaryItem.svelte";
  import CreateListAction from "./_internal/CreateListAction.svelte";
  import CreateListHeader from "./_internal/CreateListHeader.svelte";
  import PersonalListsPlaceholder from "./_internal/PersonalListsPlaceholder.svelte";
  import { useCreateList } from "./_internal/useCreateList.ts";
  import type { PersonalListType } from "./models/PersonalListType.ts";
  import { usePersonalListsSummary } from "./usePersonalListsSummary.ts";
  import UserList from "./UserList.svelte";

  const { type, slug }: { type: PersonalListType; slug: string } = $props();

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
    if ($lists.length === 1 || $isMobile || isDPad) {
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
    {#if isMine}
      <RenderFor audience="authenticated" navigation="default">
        <CreateListHeader />
      </RenderFor>

      {#if $lists.length === 0}
        <PersonalListsPlaceholder {cta} />
      {/if}
    {/if}

    {#each $lists as list (list.id)}
      <UserList {list} empty={emptyList} />
    {/each}
  {/if}

  {#if variant === "summary"}
    <SectionList
      id={`personal-lists-${type}-list`}
      items={$lists}
      {title}
      --height-list="var(--height-lists-list)"
    >
      {#snippet item(list)}
        <ListSummaryItem {list} isOfficial={false} />
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
